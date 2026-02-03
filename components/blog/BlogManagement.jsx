'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Input,
  FormHelperText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

// Helper function to normalize API URL
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  // Remove trailing /api if it exists to avoid double /api/api/
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const API_URL = getApiUrl();

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
    status: 'published',
    featuredImage: null,
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    featured: null,
    additional: []
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/blogs?status=all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blogs');
      }

      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setSelectedBlog(blog);
      setFormData({
        title: blog.title || '',
        description: blog.description || '',
        content: blog.content || '',
        tags: blog.tags ? blog.tags.join(', ') : '',
        status: blog.status || 'published',
        featuredImage: null,
        images: []
      });
      setPreviewImages({
        featured: blog.featuredImage?.url || null,
        additional: blog.images?.map(img => img.url) || []
      });
    } else {
      setSelectedBlog(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        tags: '',
        status: 'published',
        featuredImage: null,
        images: []
      });
      setPreviewImages({
        featured: null,
        additional: []
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBlog(null);
    setFormData({
      title: '',
      description: '',
      content: '',
      tags: '',
      status: 'published',
      featuredImage: null,
      images: []
    });
    setPreviewImages({
      featured: null,
      additional: []
    });
  };

  const handleMenuOpen = (event, blog) => {
    setAnchorEl(event.currentTarget);
    setSelectedBlog(blog);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBlog(null);
  };

  const handleFileChange = (e, type) => {
    const files = e.target.files;
    if (type === 'featuredImage') {
      if (files && files[0]) {
        setFormData({ ...formData, featuredImage: files[0] });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages({ ...previewImages, featured: reader.result });
        };
        reader.readAsDataURL(files[0]);
      }
    } else if (type === 'images') {
      if (files) {
        const fileArray = Array.from(files);
        setFormData({ ...formData, images: fileArray });
        const previews = [];
        fileArray.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            previews.push(reader.result);
            if (previews.length === fileArray.length) {
              setPreviewImages({ ...previewImages, additional: previews });
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('status', formData.status);
      if (formData.tags) {
        formDataToSend.append('tags', formData.tags);
      }
      if (formData.featuredImage) {
        formDataToSend.append('featuredImage', formData.featuredImage);
      }
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const url = selectedBlog
        ? `${API_URL}/api/blogs/${selectedBlog._id}`
        : `${API_URL}/api/blogs`;

      const response = await fetch(url, {
        method: selectedBlog ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save blog');
      }

      if (data.success) {
        alert(selectedBlog ? 'Blog updated successfully' : 'Blog created successfully');
        handleCloseDialog();
        fetchBlogs();
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      alert(err.message || 'Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/blogs/${selectedBlog._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete blog');
      }

      if (data.success) {
        alert('Blog deleted successfully');
        setDeleteDialogOpen(false);
        handleMenuClose();
        fetchBlogs();
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert(err.message || 'Failed to delete blog');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Blog Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#2463eb',
            '&:hover': { bgcolor: '#1d4ed8' }
          }}
        >
          Create Blog
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {blog.featuredImage?.url && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.featuredImage.url}
                    alt={blog.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                      {blog.title}
                    </Typography>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, blog)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {blog.description?.substring(0, 100)}...
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Chip
                      label={blog.status}
                      size="small"
                      color={blog.status === 'published' ? 'success' : 'default'}
                    />
                    {blog.tags?.slice(0, 2).map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Stack>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon sx={{ fontSize: 14 }} />
                      {blog.authorName}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 14 }} />
                      {formatDate(blog.createdAt)}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VisibilityIcon sx={{ fontSize: 14 }} />
                      {blog.views || 0}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedBlog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Content (HTML supported)"
              required
              multiline
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              helperText="You can use HTML tags for formatting"
            />
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              helperText="Separate tags with commas"
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <InputLabel>Featured Image</InputLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'featuredImage')}
                sx={{ mt: 1 }}
              />
              {previewImages.featured && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={previewImages.featured}
                    alt="Featured preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}
            </Box>
            <Box>
              <InputLabel>Additional Images (multiple)</InputLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'images')}
                sx={{ mt: 1 }}
              />
              {previewImages.additional.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                  {previewImages.additional.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px' }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting || !formData.title || !formData.description || !formData.content}
            sx={{ bgcolor: '#2463eb', '&:hover': { bgcolor: '#1d4ed8' } }}
          >
            {submitting ? <CircularProgress size={20} /> : selectedBlog ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleOpenDialog(selectedBlog); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}

