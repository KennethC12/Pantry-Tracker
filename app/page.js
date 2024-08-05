'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, doc, getDoc, getDocs, query, setDoc, deleteDoc} from "firebase/firestore";


export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      flexDirection={"column"}
      bgcolor={"white"} // change the whole background color
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
          width={400}
          bgcolor={"white"}
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
        style={{ backgroundColor: "blue", color: "white" }}
      >
        Add Item
      </Button>
      <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "50%" }}
        />
      <Box
        width="80%"
        maxWidth="800px"
        border="1px solid black"
        borderRadius="4px"
        overflow="hidden"
      >
        <Box
          width="100%"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          padding="16px"
        >
          <Typography variant="h4" color={"black"}>
            Inventory Items
          </Typography>
        </Box>


        <Stack
          width="100%"
          maxHeight="400px"
          spacing={2}
          overflow="auto"
          padding="16px"
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor={"#f0f0f0"}
              padding={2}
              borderRadius="4px"
            >
              <Typography variant="h6" color="#333">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333">
                {quantity}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  Add
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
