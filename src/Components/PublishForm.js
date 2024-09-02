import React, { useRef, useState, useEffect } from 'react';
import './PublishForm.css';
import info_img from './assets/info_img.svg';
import { RiArrowDropDownLine } from 'react-icons/ri';
import tagimg from './assets/tagimg.svg';

function PublishForm() {
  // State and Ref Definitions
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedAccuracy, setSelectedAccuracy] = useState('');
  const [selectedAttempts, setSelectedAttempts] = useState('');
  const [isAccuracyOpen, setIsAccuracyOpen] = useState(false);
  const [isAttemptsOpen, setIsAttemptsOpen] = useState(false);
  const [error, setError] = useState('');

  const descriptionRef = useRef(null);
  const tagsRef = useRef(null);
  const spanRef = useRef(null);
  const accuracyDropdownRef = useRef(null);
  const attemptsDropdownRef = useRef(null);

  const accuracyOptions = ['50%', '60%', '70%', '80%', '90%', '100%'];
  const attemptsOptions = ["1", "2", "3", "4"];

  // Handlers for FileName component logic
  const handleFileNameChange = (e) => {
    const value = e.target.value;
    setFileName(value);
    setError(value ? '' : 'Filename cannot be empty');
  };

  const handleFileNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!fileName.trim()) {
        setError('Filename cannot be empty');
      } else {
        descriptionRef.current.focus();
      }
    }
  };

  // Handlers for Description component logic
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      tagsRef.current.focus();
    }
  };

  // Handlers for Tags component logic
  const handleTagInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      setTags((prevTags) => [...prevTags, { id: Date.now(), text: inputValue.trim() }]);
      setInputValue('');
    }
  };

  useEffect(() => {
    if (spanRef.current && tagsRef.current) {
      spanRef.current.textContent = inputValue || tagsRef.current.placeholder;
      tagsRef.current.style.width = `${spanRef.current.offsetWidth + 2}px`;
    }
  }, [inputValue]);

  const removeTag = (idToRemove) => {
    setTags(tags.filter((tag) => tag.id !== idToRemove));
  };

  // Handlers for Accuracy dropdown
  const toggleAccuracyDropdown = () => {
    setIsAccuracyOpen(!isAccuracyOpen);
  };

  const handleAccuracyOptionClick = (option) => {
    setSelectedAccuracy(option);
    setIsAccuracyOpen(false);
  };

  // Handlers for Attempts dropdown
  const toggleAttemptsDropdown = () => {
    setIsAttemptsOpen(!isAttemptsOpen);
  };

  const handleAttemptsOptionClick = (option) => {
    setSelectedAttempts(option);
    setIsAttemptsOpen(false);
  };

  // Handlers for click outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accuracyDropdownRef.current && !accuracyDropdownRef.current.contains(event.target)) {
        setIsAccuracyOpen(false);
      }
      if (attemptsDropdownRef.current && !attemptsDropdownRef.current.contains(event.target)) {
        setIsAttemptsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers for Form Buttons
  const handleCancel = () => {
    console.log("Cancel button clicked");
    // Additional logic for cancel
  };

  const handleSubmit = () => {
    // Check if all fields are filled
    if (!fileName.trim()) {
      setError('Filename cannot be empty');
      return; // Prevent form submission
    }
    if (!description.trim()) {
      alert('Description cannot be empty'); // You can use a more sophisticated error display mechanism here
      return; // Prevent form submission
    }
    if (tags.length === 0) {
      alert('Please add at least one tag');
      return; // Prevent form submission
    }
    if (!selectedAccuracy) {
      alert('Please select an accuracy level');
      return; // Prevent form submission
    }
    if (!selectedAttempts) {
      alert('Please select the number of attempts');
      return; // Prevent form submission
    }
  
    // If all validations pass, collect the form data into a dictionary
    const formData = {
      fileName,
      description,
      tags: tags.map(tag => tag.text), // Only store the text of the tags
      accuracyLevel: selectedAccuracy,
      attempts: selectedAttempts,
      visibility: document.querySelector('input[name="visibility"]:checked').value
    };
  
    console.log('Form Data:', formData);
  
    // Clear the form fields after saving the data
    setFileName('');
    setDescription('');
    setTags([]);
    setInputValue('');
    setSelectedAccuracy('');
    setSelectedAttempts('');
    setError(''); // Clear any existing errors
  };
  

  return (
    <div className='main_container'>
      <form className="form-container">
        <div className='Info-bar'>
          <img className='form_logo' src={info_img} alt='img' />
          <div className='info'>         
            <h1 className='main-text'>Great, you’re almost done!</h1>
            <h4 className='sub-text'>Review quiz settings and you’re good to go</h4>
          </div>
        </div>

        {/* FileName Component */}
        <div className="file-name-input">
          <label htmlFor="file-name">Quiz Name</label>
          <input
            type="text"
            id="file-name"
            value={fileName}
            onChange={handleFileNameChange}
            onKeyDown={handleFileNameKeyDown}
            placeholder="e.g user1234@gmail.com"
            className={error ? 'input-error' : ''}
            required
          />
          {error && <p className="error-message"> ⚠ {error}</p>}
        </div>

        {/* Description Component */}
        <div className="description-box">
          <label htmlFor="description">Description</label><br />
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            onKeyDown={handleDescriptionKeyDown}
            placeholder="e.g Tell people what this quiz is all about"
            ref={descriptionRef}
          />
        </div>

        {/* Tags Component */}
        <div className="tags-input-container">
          <label htmlFor="tags" className="tags-label">Tag</label>
          <div className="tags-box">
            {tags.map((tag) => (
              <div key={tag.id} className="tag-item">
                <img src={tagimg} alt='tag' className="tag-img" />
                <span className="tag-text">{tag.text}</span>
                <button className="remove-tag-button" onClick={() => removeTag(tag.id)}>✕</button>
              </div>
            ))}
            <span ref={spanRef} className="hidden-measurer"></span>
            <input
              type="text"
              id="tags"
              value={inputValue}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              placeholder="+ Add a tag"
              className="tags-input"
              ref={tagsRef}
            />
          </div>
        </div>

        <div className='accuracy_attempt_container'>
          {/* Accuracy Component */}
          <div className="dropdown-container" ref={accuracyDropdownRef}>
            <label className="dropdown-label">Accuracy Level</label>
            <div className="dropdown">
              <div className="dropdown-header" onClick={toggleAccuracyDropdown}>
                {selectedAccuracy || 'Choose accuracy level'}
                <RiArrowDropDownLine className={`dropdown-icon ${isAccuracyOpen ? 'open' : ''}`} />
              </div>
              {isAccuracyOpen && (
                <ul className="dropdown-list">
                  {accuracyOptions.map((option, index) => (
                    <li
                      key={index}
                      className="dropdown-list-item"
                      onClick={() => handleAccuracyOptionClick(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Attempts Component */}
          <div className="dropdown-container" ref={attemptsDropdownRef}>
            <label className="dropdown-label">Attempts</label>
            <div className="dropdown">
              <div className="dropdown-header" onClick={toggleAttemptsDropdown}>
                {selectedAttempts || 'Choose attempts'}
                <RiArrowDropDownLine className={`dropdown-icon ${isAttemptsOpen ? 'open' : ''}`} />
              </div>
              {isAttemptsOpen && (
                <ul className="dropdown-list">
                  {attemptsOptions.map((option, index) => (
                    <li
                      key={index}
                      className="dropdown-list-item"
                      onClick={() => handleAttemptsOptionClick(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* VisibilityToggle Component */}
        <div className="visibility-container">
          <h6 className="visibility-title">Visibility</h6>
          <div className='toggle-container'>
            <div className="toggle-option">
              <label className="toggle-label">
                <input type="radio" name="visibility" value="public" />
                <span className="toggle-custom">
                  <span className="toggle-radio"></span>
                  <span className="toggle-text">
                    <span className="toggle-title">Publicly visible</span>
                    <span className="toggle-subtitle">Make it publicly visible to everyone in this portal</span>
                  </span>
                </span>
              </label>
            </div>
            <div className="toggle-option">
              <label className="toggle-label">
                <input type="radio" name="visibility" value="private" defaultChecked />
                <span className="toggle-custom">
                  <span className="toggle-radio"></span>
                  <span className="toggle-text">
                    <span className="toggle-title">Privately visible</span>
                    <span className="toggle-subtitle">Make it visible to only you and the people you share with</span>
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* FormButtons Component */}
        <div className="button-container">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="submit-button" onClick={handleSubmit}>
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}

export default PublishForm;
