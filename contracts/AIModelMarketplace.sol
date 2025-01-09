// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 ratingSum;
        uint8 ratingCount;
    }

    Model[] public models;
    mapping(address => uint256) public balances;

    event ModelListed(uint256 modelId, string name, uint256 price, address creator);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint8 rating);

    function listModel(string memory name, string memory description, uint256 price) public {
    require(bytes(name).length > 0, "Model name cannot be empty");
    require(bytes(description).length > 0, "Description cannot be empty");
    require(price > 0, "Price must be greater than 0");

    models.push(Model(name, description, price, payable(msg.sender), 0, 0));
    emit ModelListed(models.length - 1, name, price, msg.sender);
}


    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect payment amount");
        balances[model.creator] += msg.value;
        emit ModelPurchased(modelId, msg.sender);
    }

    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Model does not exist");
        require(rating > 0 && rating <= 5, "Rating must be between 1 and 5");
        Model storage model = models[modelId];
        model.ratingSum += rating;
        model.ratingCount++;
        emit ModelRated(modelId, rating);
    }

    function withdrawFunds() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds to withdraw");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getModelDetails(uint256 modelId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            address,
            uint8
        )
    {
        require(modelId < models.length, "Model does not exist");
        Model memory model = models[modelId];
        uint8 averageRating = model.ratingCount > 0 ? model.ratingSum / model.ratingCount : 0;
        return (model.name, model.description, model.price, model.creator, averageRating);
    }

    function getModelsCount() public view returns (uint256) {
        return models.length;
    }
}
