import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  Image,
  Link,
  Users,
  Eye,
  Globe,
  Lock,
} from "lucide-react";
import FireStore from "../api/FireStore";
import { getAuth } from "firebase/auth";

const CreatePost = ({ isOpen, setIsOpen }) => {
  const [postType, setPostType] = useState("discussion");
  const [visibility, setVisibility] = useState("public");
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const postTypes = [
    {
      value: "discussion",
      label: "Discussion",
      icon: Users,
      desc: "Start a conversation or ask questions",
    },
    {
      value: "research",
      label: "Research Paper",
      icon: FileText,
      desc: "Share your research work",
    },
    {
      value: "announcement",
      label: "Announcement",
      icon: Globe,
      desc: "Share news or updates",
    },
  ];

  const popularTags = [
    "Machine Learning",
    "Computer Science",
    "AI",
    "Data Science",
    "Research Methods",
    "Statistics",
    "Programming",
    "Academic Writing",
    "Literature Review",
    "Methodology",
  ];
  function tagsSubmit(e) {
    e.preventDefault();
    const tagInput = e.target.querySelector("input[type='text']");
    const newTag = tagInput.value.trim();
    if (newTag && !selectedTags.includes(newTag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, newTag]);
      tagInput.value = ""; // Clear input after adding
    }
  }
  const addTag = (tag) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };
  async function sendStatus(title, content) {
    const auth = getAuth();
    const user = auth.currentUser;

    const displayName = user?.displayName || "Anonymous";
    const email = user?.email || "unknown@example.com";
    const uid = user?.uid || "unknown";

    // Generate initials from display name
    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const postData = {
      postId: Date.now() + Math.random().toString(36).substring(2, 15),
      title,
      authorBg: "bg-gradient-to-br from-green-500 to-teal-600",
      excerpt: content,
      tags: selectedTags,
      type: postType,
      visibility,
      author: displayName,
      authorInitials: initials,
      authorEmail: email,
      authorId: uid,
      likes: 0,
      comments: 0,
      liked: false,
      time: new Date().toLocaleString(),
    };

    await FireStore(postData);
    setIsOpen(false);
    setTitle("");
    setContent("");
    setSelectedTags([]);
  }
  // Here you would typically send the post data to your backend or Firestore

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black opacity-100  flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2  shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {" "}
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Create New Post
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        {/* Main content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Left side */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* Post Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Post Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {postTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setPostType(type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        postType === type.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon
                          className={`w-5 h-5 mr-2 ${
                            postType === type.value
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            postType === type.value
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {type.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter a compelling title for your post..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Write your post content here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-2">
                  {[
                    { icon: FileText, label: "Attach File" },
                    { icon: Image, label: "Add Image" },
                    { icon: Link, label: "Add Link" },
                  ].map(({ icon: Icon, label }, idx) => (
                    <button
                      key={idx}
                      className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {label}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500">0/2000 characters</span>
              </div>
            </div>

            {/* Upload for research papers */}
          </div>

          {/* Right side - Settings */}
          <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
            {/* Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Visibility
              </label>
              <div className="space-y-2">
                {[
                  {
                    val: "public",
                    label: "Public",
                    Icon: Globe,
                    color: "text-green-600",
                  },
                  {
                    val: "private",
                    label: "Private",
                    Icon: Lock,
                    color: "text-orange-600",
                  },
                ].map(({ val, Icon, label, color }) => (
                  <button
                    key={val}
                    onClick={() => setVisibility(val)}
                    className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                      visibility === val
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${color}`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-700">{label}</div>
                      <div className="text-sm text-gray-500">
                        {val === "public"
                          ? "Anyone can see this post"
                          : "Only you can see this post"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tags <span className="text-gray-500">(up to 5)</span>
              </label>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <form action="" onSubmit={(e) => tagsSubmit(e)}>
                <input
                  type="text"
                  placeholder="Add a tag..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
                />
              </form>
              <p className="text-sm text-gray-600 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    disabled={
                      selectedTags.includes(tag) || selectedTags.length >= 5
                    }
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Category (only for research) */}
            {postType === "research" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="">Select a category</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="engineering">Engineering</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="biology">Biology</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="social-science">Social Science</option>
                  <option value="literature">Literature</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Preview */}
          </div>
        </div>
        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <span className="text-sm text-gray-600">
              {visibility === "public"
                ? "This post will be visible to everyone"
                : "This post will be private"}
            </span>
            {visibility === "public" ? (
              <Globe className="w-4 h-4 text-green-600" />
            ) : (
              <Lock className="w-4 h-4 text-orange-600" />
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-2 cursor-pointer bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors">
              Save Draft
            </button>
            <button
              className="px-2 cursor-pointer sm:px-6 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              onClick={() => sendStatus(title, content)}
              disabled={!title && !content}
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

// import React, { useState, useRef } from "react";
// import {
//   X,
//   Upload,
//   FileText,
//   Image,
//   Link,
//   Users,
//   Eye,
//   Globe,
//   Lock,
//   File,
//   ExternalLink,
//   Trash2,
// } from "lucide-react";
// import FireStore from "../api/FireStore";
// import { getAuth } from "firebase/auth";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "../firebaseConfig";
// const CreatePost = ({ isOpen, setIsOpen }) => {
//   const [postType, setPostType] = useState("discussion");
//   const [visibility, setVisibility] = useState("public");
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   // New states for attachments
//   const [attachedFiles, setAttachedFiles] = useState([]);
//   const [attachedImages, setAttachedImages] = useState([]);
//   const [attachedLinks, setAttachedLinks] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [showLinkInput, setShowLinkInput] = useState(false);
//   const [linkUrl, setLinkUrl] = useState("");
//   const [linkTitle, setLinkTitle] = useState("");

//   // Refs for file inputs
//   const fileInputRef = useRef(null);
//   const imageInputRef = useRef(null);

//   const postTypes = [
//     {
//       value: "discussion",
//       label: "Discussion",
//       icon: Users,
//       desc: "Start a conversation or ask questions",
//     },
//     {
//       value: "research",
//       label: "Research Paper",
//       icon: FileText,
//       desc: "Share your research work",
//     },
//     {
//       value: "announcement",
//       label: "Announcement",
//       icon: Globe,
//       desc: "Share news or updates",
//     },
//   ];

//   const popularTags = [
//     "Machine Learning",
//     "Computer Science",
//     "AI",
//     "Data Science",
//     "Research Methods",
//     "Statistics",
//     "Programming",
//     "Academic Writing",
//     "Literature Review",
//     "Methodology",
//   ];

//   function tagsSubmit(e) {
//     e.preventDefault();
//     const tagInput = e.target.querySelector("input[type='text']");
//     const newTag = tagInput.value.trim();
//     if (newTag && !selectedTags.includes(newTag) && selectedTags.length < 5) {
//       setSelectedTags([...selectedTags, newTag]);
//       tagInput.value = "";
//     }
//   }

//   const addTag = (tag) => {
//     if (!selectedTags.includes(tag) && selectedTags.length < 5) {
//       setSelectedTags([...selectedTags, tag]);
//     }
//   };

//   const removeTag = (tagToRemove) => {
//     setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
//   };

//   // File upload function
//   const uploadFileToStorage = async (file) => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) throw new Error("User not authenticated");

//     const timestamp = Date.now();
//     const fileName = `${user.uid}/${timestamp}_${file.name}`;
//     const storageRef = ref(storage, `posts/${fileName}`);

//     const snapshot = await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(snapshot.ref);

//     return downloadURL;
//   };

//   // Handle file attachment
//   const handleFileAttach = async (event) => {
//     const files = Array.from(event.target.files);
//     setIsUploading(true);

//     try {
//       for (const file of files) {
//         // Check file size (max 10MB)
//         if (file.size > 10 * 1024 * 1024) {
//           alert(`File ${file.name} is too large. Maximum size is 10MB.`);
//           continue;
//         }

//         const downloadURL = await uploadFileToStorage(file);

//         const fileData = {
//           id: Date.now() + Math.random(),
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           url: downloadURL,
//         };

//         setAttachedFiles((prev) => [...prev, fileData]);
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("Error uploading file. Please try again.");
//     } finally {
//       setIsUploading(false);
//       event.target.value = "";
//     }
//   };

//   // Handle image attachment
//   const handleImageAttach = async (event) => {
//     const files = Array.from(event.target.files);
//     setIsUploading(true);

//     try {
//       for (const file of files) {
//         // Check if file is an image
//         if (!file.type.startsWith("image/")) {
//           alert(`${file.name} is not a valid image file.`);
//           continue;
//         }

//         // Check file size (max 5MB for images)
//         if (file.size > 5 * 1024 * 1024) {
//           alert(`Image ${file.name} is too large. Maximum size is 5MB.`);
//           continue;
//         }

//         const downloadURL = await uploadFileToStorage(file);

//         const imageData = {
//           id: Date.now() + Math.random(),
//           name: file.name,
//           size: file.size,
//           type: file.type,
//           url: downloadURL,
//         };

//         setAttachedImages((prev) => [...prev, imageData]);
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Error uploading image. Please try again.");
//     } finally {
//       setIsUploading(false);
//       event.target.value = "";
//     }
//   };

//   // Handle link addition
//   const handleAddLink = () => {
//     if (!linkUrl.trim()) return;

//     let url = linkUrl.trim();
//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       url = "https://" + url;
//     }

//     const linkData = {
//       id: Date.now() + Math.random(),
//       url: url,
//       title: linkTitle.trim() || url,
//     };

//     setAttachedLinks((prev) => [...prev, linkData]);
//     setLinkUrl("");
//     setLinkTitle("");
//     setShowLinkInput(false);
//   };

//   // Remove attachment functions
//   const removeFile = (fileId) => {
//     setAttachedFiles((prev) => prev.filter((file) => file.id !== fileId));
//   };

//   const removeImage = (imageId) => {
//     setAttachedImages((prev) => prev.filter((image) => image.id !== imageId));
//   };

//   const removeLink = (linkId) => {
//     setAttachedLinks((prev) => prev.filter((link) => link.id !== linkId));
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   async function sendStatus(title, content) {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     const displayName = user?.displayName || "Anonymous";
//     const email = user?.email || "unknown@example.com";
//     const uid = user?.uid || "unknown";

//     const initials = displayName
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();

//     const postData = {
//       title,
//       content,
//       tags: selectedTags,
//       type: postType,
//       visibility,
//       author: displayName,
//       authorInitials: initials,
//       authorEmail: email,
//       authorId: uid,
//       time: new Date().toLocaleString(),
//       attachments: {
//         files: attachedFiles,
//         images: attachedImages,
//         links: attachedLinks,
//       },
//     };

//     await FireStore(postData);

//     // Reset form
//     setIsOpen(false);
//     setTitle("");
//     setContent("");
//     setSelectedTags([]);
//     setAttachedFiles([]);
//     setAttachedImages([]);
//     setAttachedLinks([]);
//   }

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white border-2 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
//             Create New Post
//           </h2>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
//           >
//             <X className="w-6 h-6 text-gray-600" />
//           </button>
//         </div>

//         {/* Main content */}
//         <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
//           {/* Left side */}
//           <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
//             {/* Post Type */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Post Type
//               </label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {postTypes.map((type) => {
//                   const Icon = type.icon;
//                   return (
//                     <button
//                       key={type.value}
//                       onClick={() => setPostType(type.value)}
//                       className={`p-4 rounded-lg border-2 text-left transition-all ${
//                         postType === type.value
//                           ? "border-blue-500 bg-blue-50 shadow-md"
//                           : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
//                       }`}
//                     >
//                       <div className="flex items-center mb-2">
//                         <Icon
//                           className={`w-5 h-5 mr-2 ${
//                             postType === type.value
//                               ? "text-blue-600"
//                               : "text-gray-600"
//                           }`}
//                         />
//                         <span
//                           className={`font-medium ${
//                             postType === type.value
//                               ? "text-blue-700"
//                               : "text-gray-700"
//                           }`}
//                         >
//                           {type.label}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-500">{type.desc}</p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Title */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 type="text"
//                 placeholder="Enter a compelling title for your post..."
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//               />
//             </div>

//             {/* Content */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Content <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 rows={6}
//                 placeholder="Write your post content here..."
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
//               />
//               <div className="flex justify-between items-center mt-2">
//                 <div className="flex space-x-2">
//                   {/* Attach File Button */}
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={isUploading}
//                     className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
//                   >
//                     <FileText className="w-4 h-4 mr-1" />
//                     {isUploading ? "Uploading..." : "Attach File"}
//                   </button>

//                   {/* Add Image Button */}
//                   <button
//                     onClick={() => imageInputRef.current?.click()}
//                     disabled={isUploading}
//                     className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
//                   >
//                     <Image className="w-4 h-4 mr-1" />
//                     Add Image
//                   </button>

//                   {/* Add Link Button */}
//                   <button
//                     onClick={() => setShowLinkInput(!showLinkInput)}
//                     className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
//                   >
//                     <Link className="w-4 h-4 mr-1" />
//                     Add Link
//                   </button>
//                 </div>
//                 <span className="text-sm text-gray-500">
//                   {content.length}/2000 characters
//                 </span>
//               </div>
//             </div>

//             {/* Hidden file inputs */}
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
//               onChange={handleFileAttach}
//               className="hidden"
//             />
//             <input
//               ref={imageInputRef}
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImageAttach}
//               className="hidden"
//             />

//             {/* Link Input */}
//             {showLinkInput && (
//               <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//                 <h4 className="text-sm font-semibold text-gray-700 mb-3">
//                   Add Link
//                 </h4>
//                 <div className="space-y-3">
//                   <input
//                     type="url"
//                     value={linkUrl}
//                     onChange={(e) => setLinkUrl(e.target.value)}
//                     placeholder="Enter URL (e.g., https://example.com)"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                   <input
//                     type="text"
//                     value={linkTitle}
//                     onChange={(e) => setLinkTitle(e.target.value)}
//                     placeholder="Link title (optional)"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={handleAddLink}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
//                     >
//                       Add Link
//                     </button>
//                     <button
//                       onClick={() => setShowLinkInput(false)}
//                       className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Attached Files Display */}
//             {attachedFiles.length > 0 && (
//               <div className="mb-6">
//                 <h4 className="text-sm font-semibold text-gray-700 mb-3">
//                   Attached Files
//                 </h4>
//                 <div className="space-y-2">
//                   {attachedFiles.map((file) => (
//                     <div
//                       key={file.id}
//                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                     >
//                       <div className="flex items-center">
//                         <File className="w-5 h-5 text-gray-600 mr-2" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-700">
//                             {file.name}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {formatFileSize(file.size)}
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => removeFile(file.id)}
//                         className="p-1 hover:bg-gray-200 rounded-full transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Attached Images Display */}
//             {attachedImages.length > 0 && (
//               <div className="mb-6">
//                 <h4 className="text-sm font-semibold text-gray-700 mb-3">
//                   Attached Images
//                 </h4>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                   {attachedImages.map((image) => (
//                     <div key={image.id} className="relative">
//                       <img
//                         src={image.url}
//                         alt={image.name}
//                         className="w-full h-24 object-cover rounded-lg border border-gray-200"
//                       />
//                       <button
//                         onClick={() => removeImage(image.id)}
//                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Attached Links Display */}
//             {attachedLinks.length > 0 && (
//               <div className="mb-6">
//                 <h4 className="text-sm font-semibold text-gray-700 mb-3">
//                   Attached Links
//                 </h4>
//                 <div className="space-y-2">
//                   {attachedLinks.map((link) => (
//                     <div
//                       key={link.id}
//                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                     >
//                       <div className="flex items-center">
//                         <ExternalLink className="w-5 h-5 text-gray-600 mr-2" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-700">
//                             {link.title}
//                           </p>
//                           <p className="text-xs text-gray-500">{link.url}</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => removeLink(link.id)}
//                         className="p-1 hover:bg-gray-200 rounded-full transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right side - Settings */}
//           <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto">
//             {/* Visibility */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Visibility
//               </label>
//               <div className="space-y-2">
//                 {[
//                   {
//                     val: "public",
//                     label: "Public",
//                     Icon: Globe,
//                     color: "text-green-600",
//                   },
//                   {
//                     val: "private",
//                     label: "Private",
//                     Icon: Lock,
//                     color: "text-orange-600",
//                   },
//                 ].map(({ val, Icon, label, color }) => (
//                   <button
//                     key={val}
//                     onClick={() => setVisibility(val)}
//                     className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
//                       visibility === val
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <Icon className={`w-5 h-5 mr-3 ${color}`} />
//                     <div className="text-left">
//                       <div className="font-medium text-gray-700">{label}</div>
//                       <div className="text-sm text-gray-500">
//                         {val === "public"
//                           ? "Anyone can see this post"
//                           : "Only you can see this post"}
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tags */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Tags <span className="text-gray-500">(up to 5)</span>
//               </label>
//               {selectedTags.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   {selectedTags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
//                     >
//                       {tag}
//                       <button
//                         onClick={() => removeTag(tag)}
//                         className="ml-2 hover:text-blue-900"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//               <form onSubmit={tagsSubmit}>
//                 <input
//                   type="text"
//                   placeholder="Add a tag..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-3"
//                 />
//               </form>
//               <p className="text-sm text-gray-600 mb-2">Popular tags:</p>
//               <div className="flex flex-wrap gap-2">
//                 {popularTags.slice(0, 6).map((tag) => (
//                   <button
//                     key={tag}
//                     onClick={() => addTag(tag)}
//                     disabled={
//                       selectedTags.includes(tag) || selectedTags.length >= 5
//                     }
//                     className={`px-3 py-1 text-sm rounded-full transition-colors ${
//                       selectedTags.includes(tag)
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     }`}
//                   >
//                     {tag}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Category (only for research) */}
//             {postType === "research" && (
//               <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Category
//                 </label>
//                 <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
//                   <option value="">Select a category</option>
//                   <option value="computer-science">Computer Science</option>
//                   <option value="engineering">Engineering</option>
//                   <option value="mathematics">Mathematics</option>
//                   <option value="physics">Physics</option>
//                   <option value="biology">Biology</option>
//                   <option value="chemistry">Chemistry</option>
//                   <option value="social-science">Social Science</option>
//                   <option value="literature">Literature</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
//           <div className="flex items-center space-x-2 mb-2 sm:mb-0">
//             <span className="text-sm text-gray-600">
//               {visibility === "public"
//                 ? "This post will be visible to everyone"
//                 : "This post will be private"}
//             </span>
//             {visibility === "public" ? (
//               <Globe className="w-4 h-4 text-green-600" />
//             ) : (
//               <Lock className="w-4 h-4 text-orange-600" />
//             )}
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="px-6 py-2 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               Cancel
//             </button>
//             <button className="px-6 py-2 cursor-pointer bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors">
//               Save Draft
//             </button>
//             <button
//               className="px-2 cursor-pointer sm:px-6 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
//               onClick={() => sendStatus(title, content)}
//               disabled={!title || !content || isUploading}
//             >
//               {isUploading ? "Uploading..." : "Publish Post"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePost;
