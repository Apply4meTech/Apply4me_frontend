'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Pagination
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MainLayout from '../../components/layouts/MainLayout';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Helper function to normalize API URL
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  // Remove trailing /api if it exists to avoid double /api/api/
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const API_URL = getApiUrl();

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/blogs?page=${page}&limit=12`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blogs');
      }

      if (data.success) {
        setBlogs(data.blogs || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        throw new Error(data.error || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: { xs: 4, md: 6 }
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            px: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            '& .MuiContainer-root': {
              maxWidth: '100%'
            }
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Our Blog
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              Stay updated with the latest insights, tips, and stories from our team
            </Typography>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && blogs.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No blogs available yet. Check back soon!
              </Typography>
            </Box>
          )}

          {!loading && !error && blogs.length > 0 && (
            <>
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
                  mb: 4,
                  width: '100%'
                }}
              >
                {blogs.map((blog) => (
                  <Box
                    key={blog._id}
                    sx={{
                      display: 'flex',
                      width: '100%'
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
                        cursor: 'pointer',
                        border: 'none'
                      }}
                    >
                      <CardActionArea
                        onClick={() => router.push(`/blogs/${blog.slug || blog._id}`)}
                        sx={{ 
                          flexGrow: 1, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'stretch',
                          '&:hover': {
                            '& .MuiCardActionArea-focusHighlight': {
                              opacity: 0
                            }
                          }
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
                          '&:last-child': { pb: { xs: 2.5, sm: 3 } }
                        }}>
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
                            {truncateText(blog.description, 120)}
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
                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Box>
                ))}
              </Box>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
}

