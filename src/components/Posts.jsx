import React, { useEffect, useState } from "react";
import { deletePost, getPost } from "../services/PostApi";
import { enqueueSnackbar } from "notistack";
import Form from "./Form";
import { Modal } from "react-bootstrap";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteModalClose = () => {
    setDeleteModal(false);
    setPostIdToDelete(null);
  };

  const handleDeleteModalShow = (postId) => {
    setDeleteModal(true);
    setPostIdToDelete(postId);
  };

  // Get post Function
  const getPostData = async () => {
    try {
      const res = await getPost();
      if (res.status === 200) {
        setPosts(res.data);
      } else {
        enqueueSnackbar("Failed to fetch posts", { variant: "error" });
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      enqueueSnackbar("Error fetching posts", { variant: "error" });
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  // Delete Function
  const handleDeletePost = async (id) => {
    setLoading(true);
    try {
      const res = await deletePost(id);
      if (res.status === 200) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        enqueueSnackbar("Post deleted successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to delete post", { variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      enqueueSnackbar("Error deleting post", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Update Function

  const handleUpdatePost = (post) => setUpdateData(post);

  return (
    <>
      <section className="form_section ">
        <div className="container">
          <div className="row justify-content-center">
              <Form posts={posts} setPosts={setPosts} updateData={updateData} setUpdateData={setUpdateData} />
          </div>
        </div>
      </section>
      <section className="post_section">
        <div className="container">
          <div className="row">
            {posts.map((post) => (
              <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                <div id={`post_card_${post.id}`} className="post_card">
                  <h6>{post.title}</h6>
                  <p>{post.body}</p>
                  <button
                    className="edit_btn"
                    onClick={() => handleUpdatePost(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete_btn"
                    onClick={() => handleDeleteModalShow(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Modal
        show={deleteModal}
        onHide={handleDeleteModalClose}
        centered
        className="delete_modal"
      >
        <div className="modal-header">
          <h1 className="modal-title fs-5">Delete Modal</h1>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this post?</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="no_btn"
            onClick={handleDeleteModalClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="yes_btn"
            onClick={() => {
              handleDeletePost(postIdToDelete);
              handleDeleteModalClose();
            }}
          >
            Delete
            {loading && (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Posts;
