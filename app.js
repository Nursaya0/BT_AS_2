let web3;//hh
let contract;
const contractAddress = '0xD284EEA021E4601b881AD452d2Aff229DeE971be'; // Укажите адрес вашего контракта
const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "ModelListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        }
      ],
      "name": "ModelPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "rating",
          "type": "uint8"
        }
      ],
      "name": "ModelRated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "models",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "ratingSum",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "ratingCount",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "listModel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        }
      ],
      "name": "purchaseModel",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "rating",
          "type": "uint8"
        }
      ],
      "name": "rateModel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        }
      ],
      "name": "getModelDetails",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getModelsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

async function connectMetaMask() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            document.getElementById('address').innerText = accounts[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
            loadModels();
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        alert('MetaMask is not installed. Please install MetaMask to use this dApp.');
    }
}

async function listModel() {
    const name = document.getElementById('modelName').value.trim();
    const description = document.getElementById('modelDescription').value.trim();
    const priceInput = document.getElementById('modelPrice').value.trim();

    if (!name || !description || !priceInput) {
        alert("Please fill in all fields.");
        return;
    }

    const price = web3.utils.toWei(priceInput, 'ether');
    const accounts = await web3.eth.getAccounts();

    try {
        console.log("Sending transaction to list model...");
        console.log({ name, description, price, account: accounts[0] });

        await contract.methods.listModel(name, description, price).send({ from: accounts[0] });

        alert('Model listed successfully!');
        loadModels();
    } catch (error) {
        console.error("Error while listing model:", error);
        alert('Failed to list the model.');
    }
}


async function loadModels() {
    try {
        const modelsContainer = document.getElementById('models');
        modelsContainer.innerHTML = '';

        // Получаем количество моделей
        const modelCount = await contract.methods.getModelsCount().call();
        console.log("Model count:", modelCount); // Для отладки

        for (let i = 0; i < modelCount; i++) {
            // Получаем детали модели
            const model = await contract.methods.getModelDetails(i).call();
            
            // Создаем элемент для отображения модели
            const modelElement = document.createElement('div');
            modelElement.className = 'model';
            modelElement.innerHTML = `
                <h3>${model[0]}</h3>
                <p>${model[1]}</p>
                <p>Price: ${web3.utils.fromWei(model[2], 'ether')} ETH</p>
                <p>Average Rating: ${model[4]}/5</p>
                <button onclick="purchaseModel(${i})">Purchase</button>
                <button onclick="rateModel(${i})">Rate</button>
            `;
            modelsContainer.appendChild(modelElement);
        }
    } catch (error) {
        console.error("Failed to load models:", error);
        alert("Failed to load models.");
    }
}


async function purchaseModel(modelId) {
    const accounts = await web3.eth.getAccounts();
    const model = await contract.methods.getModelDetails(modelId).call();

    try {
        await contract.methods.purchaseModel(modelId).send({ from: accounts[0], value: model[2] });
        alert('Model purchased successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to purchase the model.');
    }
}

async function rateModel(modelId) {
    const rating = prompt("Enter your rating (1-5):");
    if (rating < 1 || rating > 5) {
        alert("Rating must be between 1 and 5.");
        return;
    }

    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.rateModel(modelId, rating).send({ from: accounts[0] });
        alert('Model rated successfully!');
        loadModels();
    } catch (error) {
        console.error(error);
        alert('Failed to rate the model.');
    }
}

async function viewModelDetails(modelId) {
    try {
        const model = await contract.methods.getModelDetails(modelId).call();
        alert(`Name: ${model[0]}\nDescription: ${model[1]}\nPrice: ${web3.utils.fromWei(model[2], 'ether')} ETH\nAverage Rating: ${model[4]}/5`);
    } catch (error) {
        console.error("Failed to fetch model details:", error);
        alert("Failed to fetch model details.");
    }
}

async function withdrawFunds() {
    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.withdrawFunds().send({ from: accounts[0] });
        alert('Funds withdrawn successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to withdraw funds.');
    }
}

// Запускаем подключение к MetaMask при загрузке страницы
window.onload = connectMetaMask;

// Навешиваем события на кнопки
document.getElementById('listModelBtn').addEventListener('click', listModel);
document.getElementById('withdrawFundsBtn').addEventListener('click', withdrawFunds);
