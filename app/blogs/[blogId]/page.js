'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../../../components/layouts/MainLayout';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Helper function to normalize API URL
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  // Remove trailing /api if it exists to avoid double /api/api/
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const API_URL = getApiUrl();

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.blogId;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/blogs/${blogId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blog');
      }

      if (data.success) {
        setBlog(data.blog);
      } else {
        throw new Error(data.error || 'Failed to fetch blog');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.default'
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            py: 8
          }}
        >
          <Container maxWidth="lg">
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <MuiLink
              component={Link}
              href="/blogs"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <ArrowBackIcon />
              Back to Blogs
            </MuiLink>
          </Container>
        </Box>
      </MainLayout>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: { xs: 4, md: 6 }
        }}
      >
        <Container maxWidth="md">
          <Breadcrumbs sx={{ mb: 3 }}>
            <MuiLink
              component={Link}
              href="/blogs"
              sx={{
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Blogs
            </MuiLink>
            <Typography color="text.primary">{blog.title}</Typography>
          </Breadcrumbs>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'text.primary',
                fontSize: { xs: '1.75rem', md: '2.5rem' }
              }}
            >
              {blog.title}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                mb: 3,
                flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.authorName || 'Admin'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(blog.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.views || 0} views
                </Typography>
              </Box>
            </Stack>

            {blog.tags && blog.tags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                {blog.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Stack>
            )}

            <Divider sx={{ mb: 4 }} />
          </Box>

          {blog.featuredImage?.url && (
            <Box
              sx={{
                mb: 4,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 2
              }}
            >
              <img
                src={blog.featuredImage.url}
                alt={blog.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </Box>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mb: 3,
                color: 'text.secondary',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                fontWeight: 400
              }}
            >
              {blog.description}
            </Typography>
          </Box>

          <Box
            sx={{
              mb: 4,
              '& p': {
                mb: 2,
                lineHeight: 1.8,
                color: 'text.primary'
              },
              '& h2': {
                mt: 4,
                mb: 2,
                fontWeight: 600,
                color: 'text.primary'
              },
              '& h3': {
                mt: 3,
                mb: 1.5,
                fontWeight: 600,
                color: 'text.primary'
              },
              '& ul, & ol': {
                mb: 2,
                pl: 3
              },
              '& li': {
                mb: 1,
                lineHeight: 1.8
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                my: 2
              }
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.images && blog.images.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Gallery
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                  },
                  gap: 2
                }}
              >
                {blog.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 1,
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`${blog.title} - Image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: 'center' }}>
            <MuiLink
              component={Link}
              href="/blogs"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <ArrowBackIcon />
              Back to All Blogs
            </MuiLink>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}

