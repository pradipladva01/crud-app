import React, { useEffect, useState } from "react";
import { postData, updatePost } from "../services/PostApi";
import { enqueueSnackbar } from "notistack";
import { Modal } from "react-bootstrap";

const Form = ({ posts, setPosts, updateData, setUpdateData }) => {
  const [addData, setAddData] = useState({ title: "", body: "" });
  const [editData, setEditData] = useState({ title: "", body: "" });
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (updateData?.id) {
      setEditData({
        title: updateData?.title || "",
        body: updateData?.body || "",
      });
      setEditModal(true);
    }
  }, [updateData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAddData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addPostData = async () => {
    if (!addData.title || !addData.body) {
      enqueueSnackbar("Please fill up all fields", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      const res = await postData(addData);
      if (res?.status === 201) {
        setPosts([...posts, res.data]);
        setAddData({ title: "", body: "" });
        enqueueSnackbar("Post added successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to add post", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error adding post", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updatePostData = async () => {
    setLoading(true);
    try {
      const res = await updatePost(updateData?.id, editData);
      if (res?.status === 200) {
        const updatedPosts = posts.map((post) =>
          post.id === updateData.id ? res.data : post
        );
        setPosts(updatedPosts);
        setUpdateData({});
        enqueueSnackbar("Post updated successfully", { variant: "success" });
        setEditModal(false);
      } else {
        enqueueSnackbar("Failed to update post", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error updating post", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const action = event.nativeEvent.submitter.value;
    if (action === "Add") {
      addPostData();
    }
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    updatePostData();
  };

  const handleEditModalClose = () => {
    setEditModal(false);
    setUpdateData({});
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form_field">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter title"
            autoComplete="off"
            value={addData.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="form_field">
          <label htmlFor="body">Body</label>
          <input
            type="text"
            id="body"
            name="body"
            placeholder="Enter body"
            autoComplete="off"
            value={addData.body}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" value="Add">
        Add
          {loading && (
            <div className="spinner-border text-dark" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </button>
      </form>

      {/* Edit Modal */}
      <Modal
        show={editModal}
        onHide={handleEditModalClose}
        centered
        className="edit_modal"
      >
        <div className="modal-header">
          <h5 className="modal-title">Edit Post</h5>
        </div>
        <div className="modal-body">
          <form onSubmit={handleEditSubmit}>
            <div className="form_field">
              <input
                type="text"
                id="editTitle"
                name="title"
                placeholder="Edit title"
                autoComplete="off"
                value={editData.title}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="form_field">
              <input
                type="text"
                id="editBody"
                name="body"
                placeholder="Edit body"
                autoComplete="off"
                value={editData.body}
                onChange={handleEditInputChange}
              />
            </div>
            <button type="submit" value="Edit">
              Update
              {loading && (
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Form;
