{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "iflow-qwen": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "iFlow Qwen (Backend/DevOps)",
      "options": {
        "baseURL": "https://apis.iflow.cn/v1/chat/completions",
        "apiKey": "sk-f8f34098b3bda8b3c20067619ef193a4",
        "keepAlive": true,
        "connectionPoolSize": 1,
        "maxRetries": 2,
        "streaming": true,
        "timeout": 30000,
        "headers": {
          "Connection": "keep-alive",
          "Keep-Alive": "timeout=60, max=1000"
        }
      },
      "models": {
        "qwen3-max": {
          "name": "Qwen3-Max",
          "options": {
            "temperature": 0.2
          }
        }
      }
    },
    "iflow-glm": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "iFlow GLM (UI/Frontend)",
      "options": {
        "baseURL": "https://apis.iflow.cn/v1/chat/completions",
        "apiKey": "sk-614e45520f3320f6c979501746684961",
        "keepAlive": true,
        "connectionPoolSize": 1,
        "maxRetries": 2,
        "streaming": true,
        "timeout": 30000,
        "headers": {
          "Connection": "keep-alive",
          "Keep-Alive": "timeout=60, max=1000"
        }
      },
      "models": {
        "glm-4.6": {
          "name": "GLM-4.6",
          "options": {
            "temperature": 0.3
          }
        }
      }
    },
    "iflow-kimi": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "iFlow Kimi (General/Coding)",
      "options": {
        "baseURL": "https://apis.iflow.cn/v1/chat/completions",
        "apiKey": "sk-5c25aa5f345613c05b9f556a11e2bfb7",
        "keepAlive": true,
        "connectionPoolSize": 1,
        "maxRetries": 2,
        "streaming": true,
        "timeout": 30000,
        "headers": {
          "Connection": "keep-alive",
          "Keep-Alive": "timeout=60, max=1000"
        }
      },
      "models": {
        "kimi-k2-0905": {
          "name": "Kimi K2-0905",
          "options": {
            "temperature": 0.3
          }
        }
      }
    },
    "iflow-qwen-coder": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "iFlow Qwen Coder (Hard Logic)",
      "options": {
        "baseURL": "https://apis.iflow.cn/v1/chat/completions",
        "apiKey": "sk-bfe24a8d0c433c6447ce48f80a88bd4c",
        "keepAlive": true,
        "connectionPoolSize": 1,
        "maxRetries": 2,
        "streaming": true,
        "timeout": 30000,
        "headers": {
          "Connection": "keep-alive",
          "Keep-Alive": "timeout=60, max=1000"
        }
      },
      "models": {
        "qwen3-coder-plus": {
          "name": "Qwen3-Coder-Plus",
          "options": {
            "temperature": 0.2
          }
        }
      }
    },
    "iflow-backup1": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "iFlow Backup 1 (Duplicate for Manual Switch)",
      "options": {
        "baseURL": "https://apis.iflow.cn/v1/chat/completions",
        "apiKey": "sk-7ef2b459a31a8a200658075088ba56a4",
        "keepAlive": true,
        "connectionPoolSize": 1,
        "maxRetries": 2,
        "streaming": true,
        "timeout": 30000,
        "headers": {
          "Connection": "keep-alive",
          "Keep-Alive": "timeout=60, max=1000"
        }
      },
      "models": {
        "qwen3-max": {
          "name": "Qwen3-Max (Backup)",
          "options": {
            "temperature": 0.2
          }
        },
        "glm-4.6": {
          "name": "GLM-4.6 (Backup)",
          "options": {
            "temperature": 0.3
          }
        }
      }
    },
    "iflow-backup2": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "iFlow Backup 2 (Duplicate for Manual Switch)",
      "options": {
        "baseURL": "https://apis.iflow.cn/v1/chat/completions",
        "apiKey": "sk-d3c2ff9e09c563957987921812fa2b63",
        "keepAlive": true,
        "connectionPoolSize": 1,
        "maxRetries": 2,
        "streaming": true,
        "timeout": 30000,
        "headers": {
          "Connection": "keep-alive",
          "Keep-Alive": "timeout=60, max=1000"
        }
      },
      "models": {
        "kimi-k2-0905": {
          "name": "Kimi K2-0905 (Backup)",
          "options": {
            "temperature": 0.3
          }
        },
        "qwen3-coder-plus": {
          "name": "Qwen3-Coder-Plus (Backup)",
          "options": {
            "temperature": 0.2
          }
        }
      }
    },
    "iflow-backup3": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "iFlow Backup 3 (Duplicate for Manual Switch)",
      "options": {
        "baseURL": "https://apis.iflow.cn/v1/chat/completions",
        "apiKey": "sk-ea1e4e8f5c0ef3e26fdad2dcc13528ef",
        "keepAlive": true,
        "connectionPoolSize": 1,
        "maxRetries": 2,
        "streaming": true,
        "timeout": 30000,
        "headers": {
          "Connection": "keep-alive",
          "Keep-Alive": "timeout=60, max=1000"
        }
      },
      "models": {
        "qwen3-max": {
          "name": "Qwen3-Max (Backup Alt)",
          "options": {
            "temperature": 0.2
          }
        }
      }
    }
  },
  "model": "iflow-qwen/qwen3-max",
  "permission": {
    "edit": "allow",
    "bash": "allow",
    "webfetch": "allow"
  },
  "optimization": {
    "http": {
      "keepAlive": true,
      "connectionPooling": {
        "enabled": true,
        "poolSize": 1,
        "maxSockets": 10
      },
      "retryPolicy": {
        "maxRetries": 2,
        "backoffStrategy": "exponential",
        "initialDelay": 100
      },
      "streaming": {
        "enabled": true,
        "chunkSize": 8192
      },
      "dns": {
        "cacheEnabled": true,
        "ttl": 300
      },
      "network": {
        "tcpNoDelay": true,
        "tcpKeepAlive": true,
        "timeout": 30000
      }
    }
  }
}
