import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  Avatar,
  Divider,
  Paper,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Send,
  ThumbUp,
  ThumbDown,
  Undo,
  Save,
  Cancel,
  Edit,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import jsonData from "./data.json";
import UserChangedNotification from "./Components/UserChangedNotification";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Post, User } from "./Components/MessageContext";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Help from "./Components/Help";
import Documentation from "./Components/Documentation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import llamaLogo from "./llama-logo.png";

function App() {
  const [users, setUsers] = useState<User[]>(jsonData.users);
  const [posts, setPosts] = useState<Post[]>(jsonData.posts);
  const [newPost, setNewPost] = useState("");
  const [currentID, setCurrentID] = useState(0);
  const [currentUser, setCurrentUser] = useState<User>(jsonData.users[0]);
  const [postVotes, setPostVotes] = useState<{
    [postId: number]: { upvotes: number; downvotes: number };
  }>({});
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState("");
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [isSaveConfirmationOpen, setIsSaveConfirmationOpen] = useState(false);
  const [isUndoConfirmationOpen, setIsUndoConfirmationOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleEdit = (postId: number, content: string) => {
    setIsEditing(true);
    setEditPostId(postId);
    setEditedPost(content);
  };

  const handleSaveEdit = () => {
    if (editedPost.trim() !== "") {
      const updatedPosts = posts.map((post) =>
        post.id === editPostId
          ? {
              ...post,
              content: editedPost,
              timestamp: new Date().toISOString(),
            }
          : post
      );
      setPosts(updatedPosts);
    }
    setIsEditing(false);
    setEditPostId(null);
    setEditedPost("");
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditPostId(null);
    setEditedPost("");
  };

  const handleDelete = (postId: number) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const openSaveConfirmation = () => {
    setIsSaveConfirmationOpen(true);
  };

  const closeSaveConfirmation = () => {
    setIsSaveConfirmationOpen(false);
  };

  const openUndoConfirmation = () => {
    setIsUndoConfirmationOpen(true);
  };

  const closeUndoConfirmation = () => {
    setIsUndoConfirmationOpen(false);
  };

  const addPost = () => {
    if (newPost.trim() !== "" && currentUser) {
      const newPostObj = {
        id: posts.length + 1,
        user: currentUser,
        content: newPost,
        votes: { upvotes: 0, downvotes: 0 },
        timestamp: new Date().toISOString(),
      };

      setCurrentID(currentID + 1);
      setPosts((prevPosts) => [newPostObj, ...prevPosts]);
      setNewPost("");
      setPostVotes((prevVotes) => ({
        ...prevVotes,
        [currentID]: { upvotes: 0, downvotes: 0 },
      }));
    }
  };
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  const openUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const closeUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleUserSelection = (selectedUser: User) => {
    setCurrentUser(selectedUser);
    setIsNotificationOpen(true);

    setTimeout(() => {
      setIsNotificationOpen(false);
    }, 5000);

    closeUserMenu();
    closeUndoConfirmation();
    closeSaveConfirmation();
  };

  const handleUpvote = (postId: number) => {
    setPostVotes((prevVotes) => ({
      ...prevVotes,
      [postId]: {
        upvotes: (prevVotes[postId]?.upvotes || 0) + 1,
        downvotes: prevVotes[postId]?.downvotes || 0,
      },
    }));
  };

  const handleDownvote = (postId: number) => {
    setPostVotes((prevVotes) => ({
      ...prevVotes,
      [postId]: {
        upvotes: prevVotes[postId]?.upvotes || 0,
        downvotes: (prevVotes[postId]?.downvotes || 0) + 1,
      },
    }));
  };
  const filteredPosts = selectedUser
    ? posts.filter((post) => post.user.id === selectedUser.id)
    : posts;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPost();
    }
  };
  const openDocumentation = () => {
    setIsDocumentationOpen(true);
    setIsHelpOpen(false);
    scrollDownToContent();
  };

  const closeDocumentation = () => {
    setIsDocumentationOpen(false);
  };

  const openHelp = () => {
    setIsHelpOpen(true);
    setIsDocumentationOpen(false);
    scrollDownToContent();
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  const scrollDownToContent = () => {
    const content = document.getElementById("content");
    if (content) {
      content.scrollIntoView(true);
    }
  };

  const theme = createTheme({
    typography: {
      h4: {
        fontSize: "1.5rem", // Adjust the font size as needed
        fontWeight: 600, // Adjust the font weight as needed
      },
    },
  });

  return (
    <Container
      maxWidth={false}
      style={{
        minHeight: "100vh",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* User and Logo Section */}
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "left" }}>
              <img
                src={llamaLogo}
                alt="Llama Logo"
                style={{ height: 40, marginRight: 10 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h4">DA LLAMA</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={openUserMenu}
                variant="text"
                color="inherit"
                aria-controls="user-menu"
                aria-haspopup="true"
                style={{ border: "1px solid white", borderRadius: "5px" }}
              >
                Switch User
              </Button>
              <Button
                variant="text"
                color="inherit"
                startIcon={<AccountCircleIcon />}
                style={{
                  textTransform: "none",
                  fontSize: "1.2rem",
                  marginLeft: "10px",
                  pointerEvents: "none",
                }}
              >
                {currentUser.name}
              </Button>
              <UserChangedNotification
                open={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                userName={currentUser}
              />
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={closeUserMenu}
              >
                {users.map((user) => (
                  <MenuItem
                    key={user.id}
                    onClick={() => handleUserSelection(user)}
                  >
                    {user.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>
      {/* Main Content Section (100%) */}
      <ThemeProvider theme={theme}>
        <div id="Combined section" style={{ display: "flex", flex: 1 }}>
          <div
            id="Filter Section"
            style={{
              height: "20%",
              width: "20%",
              overflowY: "auto",
              marginRight: "16px",
              marginTop: "16px",
              border: "1px solid #2196F3",
            }}
          >
            <List
              component="nav"
              aria-label="main mailbox folders"
              style={{
                marginRight: "16px",
                flexShrink: 0, // Prevent the filter list from shrinking
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  backgroundColor: theme.palette.primary.main, // Blue background color
                  color: "white", // White text color
                  padding: "10px 20px", // Adjusted padding for better appearance
                  borderRadius: "5px", // Add border radius to the title
                  display: "inline-block", // Center the text within the background
                  width: "80%",
                }}
              >
                Filter by user:
              </Typography>
              <ListItem>
                <Button
                  onClick={() => setSelectedUser(null)}
                  variant="text"
                  color="inherit"
                  size="small"
                  sx={{
                    border: "1px solid white",
                    borderRadius: "5px",
                    marginRight: "10px",
                    marginLeft: "10px",
                    "&:hover": {
                      border: "1px solid #007bff", // Change border color on hover
                    },
                  }}
                >
                  All Users
                </Button>
              </ListItem>
              {users.map((user, index) => (
                <ListItem key={user.id}>
                  <Button
                    onClick={() => setSelectedUser(user)}
                    variant="text"
                    color="inherit"
                    size="small"
                    sx={{
                      border: "1px solid white",
                      borderRadius: "5px",
                      marginRight: "10px",
                      marginLeft: "10px",
                      "&:hover": {
                        border: "1px solid #007bff", // Change border color on hover
                      },
                    }}
                  >
                    {user.name}
                  </Button>
                </ListItem>
              ))}
            </List>
          </div>
          <div id="Chat Section" style={{ flex: 1 }}>
            <Box mt={2}>
              <Paper elevation={3}>
                <div
                  style={{
                    maxHeight: "800px",
                    overflowY: "auto",
                    width: "100%",
                  }}
                  ref={messageContainerRef}
                >
                  <List>
                    {filteredPosts.map((post, index) => (
                      <ListItem key={index}>
                        <Avatar>{post.user.name[0]}</Avatar>
                        <Box ml={2}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {post.user.name}
                          </Typography>
                          {isEditing && editPostId === post.id ? (
                            <TextField
                              fullWidth
                              value={editedPost}
                              onChange={(e) => setEditedPost(e.target.value)}
                            />
                          ) : (
                            <Typography variant="body1">
                              {post.content}
                            </Typography>
                          )}
                          <Typography variant="caption" color="textSecondary">
                            {new Date(post.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box ml="Auto">
                          <Button
                            variant="text"
                            color="primary"
                            startIcon={<ThumbUp />}
                            onClick={() => handleUpvote(post.id)}
                          >
                            ({postVotes[post.id]?.upvotes || 0})
                          </Button>
                        </Box>
                        <Box ml={2}>
                          <Button
                            variant="text"
                            color="secondary"
                            startIcon={<ThumbDown />}
                            onClick={() => handleDownvote(post.id)}
                          >
                            ({postVotes[post.id]?.downvotes || 0})
                          </Button>
                        </Box>
                        {currentUser.id === post.user.id && (
                          <Box ml={2}>
                            {isEditing && editPostId === post.id ? (
                              <>
                                <Button
                                  variant="text"
                                  color="primary"
                                  startIcon={<Save />}
                                  onClick={() => openSaveConfirmation()}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="text"
                                  color="secondary"
                                  startIcon={<Cancel />}
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="text"
                                  color="secondary"
                                  startIcon={<Undo />}
                                  onClick={() => openUndoConfirmation()}
                                >
                                  Undo
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="text"
                                color="primary"
                                startIcon={<Edit />}
                                onClick={() =>
                                  handleEdit(post.id, post.content)
                                }
                              >
                                Edit
                              </Button>
                            )}
                            <Dialog
                              open={isSaveConfirmationOpen}
                              onClose={closeSaveConfirmation}
                              maxWidth="xs"
                              fullWidth
                            >
                              <DialogTitle>Confirm Save</DialogTitle>
                              <DialogContent>
                                Are you sure you want to save the changes to
                                this message?
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={closeSaveConfirmation}
                                  color="primary"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleSaveEdit();
                                    closeSaveConfirmation();
                                  }}
                                  color="primary"
                                >
                                  Confirm
                                </Button>
                              </DialogActions>
                            </Dialog>

                            <Dialog
                              open={isUndoConfirmationOpen}
                              onClose={closeUndoConfirmation}
                              maxWidth="xs"
                              fullWidth
                            >
                              <DialogTitle>Confirm Undo</DialogTitle>
                              <DialogContent>
                                Are you sure you want to undo this message?
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={closeUndoConfirmation}
                                  color="primary"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleDelete(post.id)}
                                  color="primary"
                                >
                                  Confirm
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </Box>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Paper>
            </Box>
            <Box mt={2}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label={`Add a new post as ${currentUser.name}`}
                  variant="outlined"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  onClick={addPost}
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Send />}
                >
                  Post
                </Button>
              </Box>
              <Box mt={2}>
                <Box
                  id="Documenation and help"
                  sx={{
                    position: "fixed",
                    bottom: "600px", // Adjust the distance from the bottom
                    left: "50%",
                    zIndex: 1000,
                    transform: "translateX(-50%)", // Adjusted transform value
                    display: "flex",
                    flexDirection: "column", // Updated to column direction
                    alignItems: "center", // Center align items
                    justifyContent: "center", // Center align items horizontally
                  }}
                >
                  <Box style={{ display: "flex" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        if (isDocumentationOpen) {
                          closeDocumentation();
                        } else {
                          openDocumentation();
                          closeHelp();
                        }
                      }}
                    >
                      Documentation
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        if (isHelpOpen) {
                          closeHelp();
                        } else {
                          openHelp();
                          closeDocumentation();
                        }
                      }}
                      style={{ marginLeft: "10px" }} // Adjust the spacing between buttons
                    >
                      Help
                    </Button>
                  </Box>
                  <Typography
                    variant="caption"
                    mt={1}
                    style={{ marginLeft: "10px" }}
                  >
                    &copy; Copyright 2023 by DA LLAMA
                  </Typography>
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      </ThemeProvider>
      <div id="content">
        {isDocumentationOpen && <Documentation />}
        {isHelpOpen && <Help />}
      </div>

      <Routes>
        <Route path="/help" Component={Help} />
        <Route path="/documentation" Component={Documentation} />
      </Routes>
    </Container>
  );
}

export default App;
