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
  FormHelperText,
  Divider
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
    authorName: '',
    authorEmail: '',
    featuredImage: null,
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    featured: null
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

  const handleOpenDialog = async (blog = null) => {
    if (blog) {
      try {
        // Fetch full blog details including content
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/api/blogs/${blog._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch blog details');
        }

        // Use the full blog data with content
        const fullBlog = data.blog || blog;
        setSelectedBlog(fullBlog);
        setFormData({
          title: fullBlog.title || '',
          description: fullBlog.description || '',
          content: fullBlog.content || '',
          status: fullBlog.status || 'published',
          authorName: fullBlog.authorName || '',
          authorEmail: fullBlog.author?.email || '',
          featuredImage: null
        });
        setPreviewImages({
          featured: fullBlog.featuredImage?.url || null
        });
      } catch (err) {
        console.error('Error fetching blog details:', err);
        alert(err.message || 'Failed to load blog details');
        // Fallback to using the blog data from list (without content)
        setSelectedBlog(blog);
        setFormData({
          title: blog.title || '',
          description: blog.description || '',
          content: blog.content || '',
          status: blog.status || 'published',
          authorName: blog.authorName || '',
          authorEmail: blog.author?.email || '',
          featuredImage: null
        });
        setPreviewImages({
          featured: blog.featuredImage?.url || null
        });
      }
    } else {
      setSelectedBlog(null);
      setFormData({
        title: '',
        description: '',
        content: '<h3>Introduction: Finding Bliss in Simplicity</h3>\n<p>In a culture that often celebrates excess and constant activity, the idea of a lifestyle centered around simplicity might seem counterintuitive. However, at its core, simplicity is about focusing on what truly matters and letting go of the superfluous. It\'s a mindful approach that can lead to a more meaningful and fulfilling existence.</p>\n\n<h3>Clearing the Clutter</h3>\n<p>Simplicity starts at home. Decluttering your living space is an invigorating process that allows you to create physical and mental space for what truly resonates with you. Whether it\'s cleaning out your closet, reorganizing your kitchen, or letting go of sentimental items, the act of decluttering can be liberating.</p>\n\n<h3>Mindful Consumption</h3>\n<p>In a consumer-driven society, practicing mindful consumption is a revolutionary act. Embracing quality over quantity and making intentional choices about what you bring into your life can lead to a sense of contentment and reduced environmental impact. Consider supporting sustainable and ethical brands that align with your values.</p>',
        status: 'published',
        authorName: '',
        authorEmail: '',
        featuredImage: null
      });
      setPreviewImages({
        featured: null
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
      status: 'published',
      authorName: '',
      authorEmail: '',
      featuredImage: null
    });
    setPreviewImages({
      featured: null
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
      if (formData.authorName) {
        formDataToSend.append('authorName', formData.authorName);
      }
      if (formData.featuredImage) {
        formDataToSend.append('featuredImage', formData.featuredImage);
      }

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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: { xs: 2, sm: 3, md: 3 },
            width: '100%'
          }}
        >
          {blogs.map((blog) => (
            <Box
              key={blog._id}
              sx={{
                display: 'flex',
                width: '100%',
                position: 'relative'
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  bgcolor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)'
                  },
                  border: 'none'
                }}
              >
                {blog.featuredImage?.url && (
                  <Box
                    sx={{
                      width: '100%',
                      height: { xs: '220px', sm: '240px', md: '260px' },
                      overflow: 'hidden',
                      position: 'relative',
                      bgcolor: '#f5f5f5'
                    }}
                  >
                    <img
                      src={blog.featuredImage.url}
                      alt={blog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </Box>
                )}
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  p: { xs: 2.5, sm: 3 },
                  position: 'relative',
                  '&:last-child': { pb: { xs: 2.5, sm: 3 } }
                }}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, blog)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 1)'
                      },
                      zIndex: 1
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  {blog.tags && blog.tags.length > 0 && (
                    <Chip
                      label={blog.tags[0]}
                      size="small"
                      sx={{
                        mb: 1.5,
                        height: '26px',
                        bgcolor: '#E3F2FD',
                        color: '#1976D2',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        alignSelf: 'flex-start',
                        borderRadius: '6px',
                        px: 1
                      }}
                    />
                  )}
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                    <Chip
                      label={blog.status}
                      size="small"
                      sx={{
                        height: '24px',
                        fontSize: '0.7rem',
                        bgcolor: blog.status === 'published' ? '#E8F5E9' : '#FFF3E0',
                        color: blog.status === 'published' ? '#2E7D32' : '#E65100',
                        fontWeight: 500
                      }}
                    />
                  </Stack>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: '#000',
                      fontSize: { xs: '1rem', sm: '1.125rem' },
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: { xs: '2.8rem', sm: '3.15rem' }
                    }}
                  >
                    {blog.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: '#666',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flexGrow: 1
                    }}
                  >
                    {blog.description?.substring(0, 120)}...
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: { xs: 1.5, sm: 2 },
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: '#E8E8E8',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />
                      <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.75rem', fontWeight: 400 }}>
                        {blog.authorName || 'Admin'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />
                      <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.75rem', fontWeight: 400 }}>
                        {formatDate(blog.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VisibilityIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />
                      <Typography variant="caption" sx={{ color: '#757575', fontSize: '0.75rem', fontWeight: 400 }}>
                        {blog.views || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography component="div" variant="h5" sx={{ fontWeight: 600 }}>
            {selectedBlog ? 'Edit Blog' : 'Create New Blog'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            {/* Metadata Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976D2' }}>
                Metadata
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Title / Heading"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog title"
                />
                <TextField
                  fullWidth
                  label="Short Description"
                  required
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description that appears in blog cards"
                  helperText="This will be shown in blog listing cards"
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Author Name"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="Author name"
                  />
                  <TextField
                    fullWidth
                    label="Author Email"
                    type="email"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    placeholder="author@example.com"
                  />
                </Box>
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
              </Box>
            </Box>

            <Divider />

            {/* Image Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976D2' }}>
                Images
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Featured Image *
                  </Typography>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'featuredImage')}
                    sx={{ mb: 1 }}
                  />
                  {previewImages.featured && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={previewImages.featured}
                        alt="Featured preview"
                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Content Section */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976D2' }}>
                Content
              </Typography>
              <Box sx={{ mb: 2, p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Content Structure Guide:
                </Typography>
                <Typography variant="body2" component="div" sx={{ fontSize: '0.75rem', color: '#666' }}>
                  <div>• Use <code>&lt;h2&gt;</code> for main headings</div>
                  <div>• Use <code>&lt;h3&gt;</code> for subheadings</div>
                  <div>• Use <code>&lt;p&gt;</code> for paragraphs</div>
                </Typography>
              </Box>
              <TextField
                fullWidth
                label="Blog Content (HTML)"
                required
                multiline
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="<h3>Introduction: Finding Bliss in Simplicity</h3>
<p>In a culture that often celebrates excess and constant activity, the idea of a lifestyle centered around simplicity might seem counterintuitive. However, at its core, simplicity is about focusing on what truly matters and letting go of the superfluous. It's a mindful approach that can lead to a more meaningful and fulfilling existence.</p>

<h3>Clearing the Clutter</h3>
<p>Simplicity starts at home. Decluttering your living space is an invigorating process that allows you to create physical and mental space for what truly resonates with you. Whether it's cleaning out your closet, reorganizing your kitchen, or letting go of sentimental items, the act of decluttering can be liberating.</p>

<h3>Mindful Consumption</h3>
<p>In a consumer-driven society, practicing mindful consumption is a revolutionary act. Embracing quality over quantity and making intentional choices about what you bring into your life can lead to a sense of contentment and reduced environmental impact. Consider supporting sustainable and ethical brands that align with your values.</p>"
                helperText="Use HTML tags for proper structure. Main headings (h2), subheadings (h3), and paragraphs (p) will be styled automatically."
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }
                }}
              />
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

