import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Grid, Typography, List, ListItemButton, ListItemText, Divider } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import axios from "axios";
import { ContentPasteOffSharp } from "@mui/icons-material";

const ChatBotBubble = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // on component mount, fetch the list of files from the server
  useEffect(() => {
    const fetchFiles = async () => {
      const response = await axios.get("http://localhost:8000/api/files");
      const data = response.data;
      setUploadedFiles(data.files);
    };
    fetchFiles();
  }, []);


  const handleFileChange = (event) => {
    const files = event.target.files;
    const formData = new FormData();
    formData.append("file", files[0]);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("http://localhost:8000/api/upload", formData, config)
      .then((response) => {
        console.log(response.data)
        const fetchFiles = async () => {
          const response = await axios.get("http://localhost:8000/api/files");
          const data = response.data;
          setUploadedFiles(data.files);
        };
        fetchFiles();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileClick = (fileId) => {
    console.log(fileId);
    setSelectedFile(fileId);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmitQuestion = async () => {
    // This is where you would call your actual chatbot API with the selected file and question
    // Replace this with your logic to fetch and display the answer

    const response = await axios.post("http://localhost:8000/api/predict", { unique_id: selectedFile, question: question });
    const data = response.data;
    console.log(data)
    setAnswer(data.answer)
  };

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "4px" }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Upload file pane */}
          <Box>
            <Box style={{ display: 'flex', justifyContent: 'space-between', margin: '0 20px 20px 0', border: '1px solid #C0C0C0', padding: '20px', borderRadius: '8px' }}>
              <Typography variant="subtitle1">Upload your PDF document:</Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                style={{ background: "linear-gradient(to top, #008080, #006666)" }}
              >
                Select File
                <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
              </Button>
            </Box>
            <Box style={{ margin: '0 20px 20px 0', border: '1px solid #C0C0C0', padding: '20px', borderRadius: '8px' }}>
              <Typography variant="subtitle1">Choose the existing files:</Typography>
              <List>
                {Object.keys(uploadedFiles).map((file, index) => (
                  <ListItemButton key={index} onClick={() => handleFileClick(uploadedFiles[file])} style={{ backgroundColor: selectedFile === uploadedFiles[file] ? '#C0C0C0' : '#E0E0E0', marginBottom: '10px' }}>
                    <ListItemText primary={file} />
                    {selectedFile === uploadedFiles[file] && <CheckBoxIcon fontSize="small" style={{ backgroundColor: 'green', color: 'white' }} />}
                  </ListItemButton>
                ))}
              </List>
            </Box>

          </Box>
        </Grid>
        <Grid item xs={6}>
          {/* Question and answer pane */}
          <Box style={{ margin: '0 20px 20px 0', border: '1px solid #C0C0C0', padding: '20px', borderRadius: '8px' }}>
            <div>
              <Typography variant="subtitle1">Ask your question:</Typography>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                placeholder="Type your question here..."
                value={question}
                onChange={handleQuestionChange}
                style={{ margin: "20px 0 20px 0" }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleSubmitQuestion} style={{ background: "linear-gradient(to top, #008080, #006666)" }}>
                  Ask Doc GPT
                </Button>
              </div>
            </div>
            <div>
              <Typography variant="subtitle1">Answer:</Typography>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={16}
                value={answer}
              />
            </div>

          </Box>

        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatBotBubble;
