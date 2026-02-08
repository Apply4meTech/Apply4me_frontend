'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Link as MuiLink,
  IconButton,
  Avatar,
  TextField,
  Button,
  Snackbar,
  Tooltip,
  Skeleton
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { setNewsletterSubscribed } from '../../../store/authSlice';
import MainLayout from '../../../components/layouts/MainLayout';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// Helper function to normalize API URL
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const API_URL = getApiUrl();

const BlogDetailSkeleton = () => {
  return (
    <MainLayout>
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', py: 6 }}>
        <Container maxWidth="md">
          {/* Tag Skeleton */}
          <Skeleton variant="rounded" width={100} height={32} sx={{ mb: 3 }} />

          {/* Title Skeleton */}
          <Skeleton variant="text" height={60} width="80%" sx={{ mx: "auto" }} />

          {/* Description Skeleton */}
          <Skeleton variant="text" height={25} width="90%" sx={{ mx: "auto" }} />
          <Skeleton variant="text" height={25} width="70%" sx={{ mx: "auto", mb: 4 }} />

          {/* Author Info Skeleton */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 4
            }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={180} height={18} />
            </Box>
          </Box>

          {/* Featured Image Skeleton */}
          <Skeleton
            variant="rectangular"
            height={320}
            sx={{ borderRadius: "8px", mb: 5 }}
          />

          {/* Blog Content Skeleton */}
          {Array.from(new Array(6)).map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              height={22}
              width={`${90 - index * 5}%`}
              sx={{ mb: 1 }}
            />
          ))}
        </Container>
      </Box>
    </MainLayout>
  );
};


export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params?.blogId;
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const isNewsletterSubscribed = user?.isNewsletterSubscribed || false;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Like and bookmark state
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '' });
  
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize email with user's email if logged in and not already subscribed
  useEffect(() => {
    if (isAuthenticated && user?.email && !isNewsletterSubscribed && !email) {
      setEmail(user.email);
    }
  }, [isAuthenticated, user, isNewsletterSubscribed]);

  const fetchBlog = useCallback(async () => {
    if (!blogId) return;
    
    try {
      setLoading(true);
      setError(null);
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_URL}/api/blogs/${blogId}`, {
        headers
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blog');
      }

      if (data.success) {
        setBlog(data.blog);
        // Update like and bookmark state
        setIsLiked(data.blog.isLiked || false);
        setIsBookmarked(data.blog.isBookmarked || false);
        setLikeCount(data.blog.likeCount || 0);
        setBookmarkCount(data.blog.bookmarkCount || 0);
      } else {
        throw new Error(data.error || 'Failed to fetch blog');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [blogId, token]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
    // Reset success state when user starts typing again
    if (subscriptionSuccess) {
      setSubscriptionSuccess(false);
      setSuccessMessage('');
    }
  };

  // Handle like toggle
  const handleLike = async () => {
    if (!isAuthenticated || !token) {
      setNotification({
        open: true,
        message: 'You need to login first to like this blog'
      });
      return;
    }

    if (isLiking) return; // Prevent double clicks

    setIsLiking(true);
    try {
      const response = await fetch(`${API_URL}/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle like');
      }

      if (data.success) {
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setNotification({
        open: true,
        message: err.message || 'Failed to like blog. Please try again.'
      });
    } finally {
      setIsLiking(false);
    }
  };

  // Handle bookmark toggle
  const handleBookmark = async () => {
    if (!isAuthenticated || !token) {
      setNotification({
        open: true,
        message: 'You need to login first to bookmark this blog'
      });
      return;
    }

    if (isBookmarking) return; // Prevent double clicks

    setIsBookmarking(true);
    try {
      const response = await fetch(`${API_URL}/api/blogs/${blogId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle bookmark');
      }

      if (data.success) {
        setIsBookmarked(data.isBookmarked);
        setBookmarkCount(data.bookmarkCount);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setNotification({
        open: true,
        message: err.message || 'Failed to bookmark blog. Please try again.'
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Validate email
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    setIsSubscribing(true);
    setEmailError('');
    setSubscriptionSuccess(false);
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe to newsletter');
      }

      if (data.success) {
        setSubscriptionSuccess(true);
        setSuccessMessage(data.message || 'Successfully subscribed to newsletter');
        setEmail('');
        // Update Redux state if user is authenticated
        if (isAuthenticated && user) {
          dispatch(setNewsletterSubscribed(true));
        }
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubscriptionSuccess(false);
          setSuccessMessage('');
        }, 5000);
      } else {
        throw new Error(data.error || 'Failed to subscribe to newsletter');
      }
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      setEmailError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return <BlogDetailSkeleton />;
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
          width: '100%',
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <IconButton
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              bgcolor: '#000',
              color: '#fff',
              width: 35,
              height: 35,
              borderRadius: '4px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease',
              '& svg': {
                fontSize: '24px'
              }
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        )}

        {/* Main Blog Content Section - Full Width White Background */}
        <Box
          sx={{
            width: '100%',
            bgcolor: '#fff',
            py: { xs: 4, md: 6 }
          }}
        >
          <Container maxWidth="md" >
            {/* Tag */}
            {blog.tags && blog.tags.length > 0 && (
              <Box sx={{ mb: 2}}>
                <Chip
                  label={blog.tags[0]}
                  sx={{
                    bgcolor: '#E3F2FD',
                    color: '#1976D2',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    height: '32px',
                    borderRadius: '16px'
                  }}
                />
              </Box>
            )}

            <Box sx={{  width:'90%', margin: '0 auto'}}>
            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#000',
                fontSize: { xs: '1.25rem', md: '2.25rem' },
                lineHeight: 1.2,
                textAlign: 'center'
              }}
            >
              {blog.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: '#666',
                fontSize: '0.95rem',
                lineHeight: 1.2,
                fontWeight: 400,
                textAlign: 'center'
              }}
            >
              {blog.description}
            </Typography>

           <Box sx={{display:'flex',alignItems:'center', justifyContent:'center'}}>
            {/* Author Info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 4
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#1976D2'
                }}
              >
                {blog.authorName?.charAt(0) || 'A'}
              </Avatar>
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#000',
                    fontSize: '0.85rem',
                    mb: 0.5
                  }}
                >
                  {blog.authorName || 'Admin'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#757575',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {formatDate(blog.createdAt)} • 1 min read
                </Typography>
              </Box>
            </Box>

            {/* Like and Bookmark Buttons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                mb: 4,
                ml:4,
                flexWrap: 'wrap'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <IconButton
                  onClick={handleLike}
                  disabled={isLiking}
                  sx={{
                    color: isLiked ? '#f44336' : '#757575',
                    '&:hover': {
                      bgcolor: isLiked ? 'rgba(244, 67, 54, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  aria-label="like blog"
                >
                  {isLiked ? (
                    <FavoriteIcon sx={{ fontSize: '28px' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: '28px' }} />
                  )}
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    minWidth: '30px'
                  }}
                >
                  {likeCount}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <IconButton
                  onClick={handleBookmark}
                  disabled={isBookmarking}
                  sx={{
                    color: isBookmarked ? '#1976D2' : '#757575',
                    '&:hover': {
                      bgcolor: isBookmarked ? 'rgba(25, 118, 210, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  aria-label="bookmark blog"
                >
                  {isBookmarked ? (
                    <BookmarkIcon sx={{ fontSize: '28px' }} />
                  ) : (
                    <BookmarkBorderIcon sx={{ fontSize: '28px' }} />
                  )}
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    minWidth: '30px'
                  }}
                >
                  {bookmarkCount}
                </Typography>
              </Box>
            </Box>
            </Box>
            </Box>
            {/* Featured Image */}
            {blog.featuredImage?.url && (
              <Box
                sx={{
                  mb: 4,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
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

            {/* Content */}
            <Box sx={{  width:'90%', margin: '0 auto'}}>
            <Box
              // variant="body1"
              // sx={{
              //   mb: 4,
              //   color: '#666',
              //   fontSize: '0.95rem',
              //   lineHeight: 1.2,
              //   fontWeight: 400,
               sx={{
                 '& p': {
                   margin: 0,
                   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                   fontWeight: 400,
                   fontSize: '0.95rem',
                   lineHeight: 1.2,
                   letterSpacing: '0.00938em',
                   color: '#666',
                   marginBottom: '32px',
                 },
                '& h2': {
                  mt: 2,
                  mb: 2,
                  fontWeight: 700,
                  color: '#000',
                  fontSize: '1rem',
                  lineHeight: 1.3
                },
                '& h3': {
                  mt: 1.5,
                  mb: 1.5,
                  fontWeight: 600,
                  color: '#000',
                  fontSize: '1rem',
                  lineHeight: 1.4
                },
                '& ul, & ol': {
                  mb: 2.5,
                  pl: 3,
                  '& li': {
                    mb: 1,
                    lineHeight: 1.8,
                    color: '#333',
                    fontSize: '1rem'
                  }
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  my: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                },
                '& blockquote': {
                  borderLeft: '4px solid #1976D2',
                  pl: 3,
                  py: 2,
                  my: 3,
                  bgcolor: '#F5F5F5',
                  fontStyle: 'italic',
                  color: '#555'
                }
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            </Box>

            {/* Additional Images Gallery */}
            {blog.images && blog.images.length > 0 && (
              <Box sx={{ mt: 4 }}>
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
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease'
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
          </Container>
        </Box>

        {/* Newsletter Section - Greyish Background with Padding */}
        <Box
          sx={{
            width: '100%',
            bgcolor: '#F5F5F5',
            py: { xs: 4, md: 6 },
            px: { xs: 2, sm: 3, md: 2 }
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                width: '90%',
                margin: '0 auto',
                bgcolor: '#fff',
                borderRadius: '6px',
                p: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ flex: 0.5}}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: '#000',
                    fontSize: '1rem'
                  }}
                >
                  Subscribe to Newsletter
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#757575',fontSize: '0.85rem'
                  }}
                >
                  Provide your email to get email notification when we launch new products or publish new articles
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 0.4,
                  width: { xs: '100%', md: 'auto' }
                }}
              >
                {isAuthenticated && isNewsletterSubscribed ? (
                  <Tooltip title="You are already subscribed to our newsletter" arrow>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'flex-start' }
                      }}
                    >
                      <Box sx={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                        <TextField
                          type="email"
                          placeholder="Enter your Email"
                          value={user?.email || ''}
                          disabled={true}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              backgroundColor: '#f1f8e9',
                              '& fieldset': {
                                borderColor: '#4caf50',
                              },
                            },
                            '& .MuiInputBase-input': {
                              padding: '12px 16px',
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <CheckCircleIcon
                                sx={{
                                  color: '#4caf50',
                                  fontSize: '20px',
                                  ml: 1
                                }}
                              />
                            ),
                          }}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        disabled={true}
                        sx={{
                          padding: '12px 24px',
                          borderRadius: '8px',
                          backgroundColor: '#4caf50',
                          color: '#fff',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          textTransform: 'none',
                          minWidth: '120px',
                          '&:disabled': {
                            backgroundColor: '#4caf50',
                            opacity: 0.7,
                          },
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: '18px', mr: 0.5 }} />
                        Already Subscribed
                      </Button>
                    </Box>
                  </Tooltip>
                ) : (
                  <>
                    <Box
                      component="form"
                      onSubmit={handleSubscribe}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'flex-start' }
                      }}
                    >
                      <Box sx={{ flex: 1, position: 'relative', minWidth: '200px' }}>
                        <TextField
                          type="email"
                          placeholder={isAuthenticated && user?.email ? user.email : "Enter your Email"}
                          value={email || (isAuthenticated && user?.email ? user.email : '')}
                          onChange={handleEmailChange}
                          onBlur={() => {
                            if (email) {
                              setEmailError(validateEmail(email));
                            }
                          }}
                          error={!!emailError}
                          helperText={emailError || (subscriptionSuccess && successMessage ? '' : '')}
                          disabled={isSubscribing || subscriptionSuccess || (isAuthenticated && isNewsletterSubscribed)}
                          sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              backgroundColor: subscriptionSuccess ? '#f1f8e9' : '#fff',
                              '& fieldset': {
                                borderColor: emailError ? '#d32f2f' : '#E0E0E0',
                              },
                              '&:hover fieldset': {
                                borderColor: emailError ? '#d32f2f' : '#1976D2',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: emailError ? '#d32f2f' : '#1976D2',
                              },
                            },
                            '& .MuiInputBase-input': {
                              padding: '12px 16px',
                            },
                          }}
                          InputProps={{
                            endAdornment: subscriptionSuccess && (
                              <CheckCircleIcon
                                sx={{
                                  color: '#4caf50',
                                  fontSize: '20px',
                                  ml: 1
                                }}
                              />
                            ),
                          }}
                        />
                      </Box>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubscribing || subscriptionSuccess || (isAuthenticated && isNewsletterSubscribed)}
                        sx={{
                          padding: '12px 24px',
                          borderRadius: '8px',
                          backgroundColor: subscriptionSuccess ? '#4caf50' : '#000',
                          color: '#fff',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          textTransform: 'none',
                          minWidth: '120px',
                          '&:hover': {
                            backgroundColor: subscriptionSuccess ? '#4caf50' : '#333',
                          },
                          '&:disabled': {
                            backgroundColor: subscriptionSuccess ? '#4caf50' : '#000',
                            opacity: 0.7,
                          },
                        }}
                      >
                        {isSubscribing ? (
                          <CircularProgress size={20} sx={{ color: '#fff' }} />
                        ) : subscriptionSuccess ? (
                          <>
                            <CheckCircleIcon sx={{ fontSize: '18px', mr: 0.5 }} />
                            Subscribed
                          </>
                        ) : (
                          'Subscribe'
                        )}
                      </Button>
                    </Box>
                    {subscriptionSuccess && successMessage && (
                      <Typography
                        sx={{
                          mt: 1,
                          color: '#4caf50',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: '16px' }} />
                        {successMessage}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity="info"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
}
