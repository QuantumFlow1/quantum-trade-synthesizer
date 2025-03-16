
# Ollama Integration Guide

This guide explains how to set up and use the Ollama integration in this application.

## Overview

The Ollama integration allows you to connect to a local instance of [Ollama](https://ollama.ai/) running on your machine, enabling you to use local large language models directly from the application without sending data to external APIs.

## Requirements

1. [Ollama](https://ollama.ai/) installed on your local machine
2. At least one language model pulled and available in your Ollama installation
3. Ollama server running (typically on http://localhost:11434)

## Setup Steps

### 1. Install Ollama

If you haven't already installed Ollama, visit [ollama.ai](https://ollama.ai/) and follow the installation instructions for your operating system:

- **MacOS**: Download and install the application
- **Linux**: Follow the installation commands from the Ollama website
- **Windows**: Use WSL2 (Windows Subsystem for Linux) or follow the Windows installation guide

### 2. Start the Ollama Server

Once installed, start the Ollama server:

```bash
ollama serve
```

The server will start and listen on `http://localhost:11434` by default.

### 3. Pull Language Models

Before using Ollama with our application, you need to pull at least one language model:

```bash
# For example, to pull the Llama3 model
ollama pull llama3

# Or for other models
ollama pull mistral
ollama pull phi
```

You can find available models in the [Ollama library](https://ollama.ai/library).

### 4. Connect the Application to Ollama

1. Navigate to the LLM tab in the dashboard
2. Make sure the Ollama toggle is enabled
3. Click on the settings (gear) icon in the Ollama chat window
4. Verify the Ollama Host URL (default: http://localhost:11434)
5. Click "Connect" to test the connection
6. If connected successfully, select a model from the dropdown list

## Usage

Once connected:

1. Type your messages in the input box at the bottom of the Ollama chat window
2. Press Enter or click the Send button to send your message
3. Wait for the response from your local Ollama model

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Ensure the Ollama server is running (`ollama serve`)
2. Verify the host URL in the settings (typically http://localhost:11434)
3. Check if any firewall is blocking the connection
4. Check the console for error messages

### No Models Found

If no models are displayed after connecting:

1. Ensure you've pulled at least one model using `ollama pull [model-name]`
2. Click "Check for Models" in the settings panel
3. Restart the Ollama server if needed

### Slow Responses

Model response time depends on:
- Your hardware capabilities
- The size and complexity of the model
- The length and complexity of the conversation

Smaller models like Phi-2 will generally respond faster than larger models on consumer hardware.

## Advanced Configuration

### Custom Host URL

If your Ollama server is running on a different machine or port, you can change the host URL in the settings panel:

1. Click the settings (gear) icon
2. Enter the new host URL (e.g., http://192.168.1.100:11434)
3. Click "Connect" to test the new connection

### Model Management

To manage your Ollama models directly:

```bash
# List all available models
ollama list

# Remove a model
ollama rm [model-name]

# Get model information
ollama show [model-name]
```

## Additional Resources

- [Ollama Official Documentation](https://github.com/ollama/ollama/blob/main/README.md)
- [Ollama Library](https://ollama.ai/library)
- [Ollama GitHub Repository](https://github.com/ollama/ollama)
