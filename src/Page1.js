import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios'; 
import shareOnSocialMedia from './SocialShare';
import { Helmet } from 'react-helmet';

const Page1 = () => {
  const { id } = useParams();
  const [blogItem, setBlogItem] = useState({});

  useEffect(() => {
    axios.get(`https://zogglobaltest.com/blogs/${id}`)
      .then((response) => {
        setBlogItem(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error)
      });
  }, [id]);

  const url = window.location.href;
  return (
    <>
      <Helmet>
          <title>{blogItem.title}</title>
          <meta property="og:url" content={url} />
          <meta property="og:title" content={blogItem.title} />
          <meta property="og:image" content={blogItem.image_url} />
          <meta property="og:site_name" content="Zog Global" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={blogItem.title} />
          <meta name="twitter:image" content={blogItem.image_url} />
        </Helmet>
      <h1>This is Page 1</h1>
      
        <div>
          <h2 onClick={() => shareOnSocialMedia('linkedin', url, blogItem.title)}>{blogItem.title}</h2>
          <p  >{blogItem.content}</p>
          
        </div>
    </>
  );
};

export default Page1;
