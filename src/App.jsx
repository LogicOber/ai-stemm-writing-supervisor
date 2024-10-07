import React, { useState, useCallback } from 'react';
import './App.css';
import TextInput from './TextInput';
import SnakeGame from './SnakeGame';
import XMLRenderer from './XMLRenderer';
import ErrorBoundary from './ErrorBoundary';

const API_ENDPOINT = "https://lyson-dify.zeabur.app/v1/chat-messages";
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          inputs: {},
          query: input,
          response_mode: "blocking",
          conversation_id: "",
          user: "abc-123"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutput(data.answer);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  return (
    <div className="app">
      <h1>STEMM Writing Supervisor</h1>
      <a href="https://x.com/lyson_ober" target="_blank" rel="noopener noreferrer" className="author-info">
        <img src="https://pbs.twimg.com/profile_images/1659237960259350529/UKhYunL7_400x400.jpg" alt="Lyson Ober" className="author-avatar" />
        <span className="author-name">Created by Lyson Ober</span>
      </a>
      <form onSubmit={handleSubmit}>
        <TextInput
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your text here..."
          rows={5}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Process Text'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {isLoading && <SnakeGame />}
      {output && (
        <div className="output">
          <h2>Processed Output:</h2>
          <ErrorBoundary>
            <XMLRenderer>{output}</XMLRenderer>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

export default App;