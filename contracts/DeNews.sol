// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeNews is ERC20, Ownable {
    // Token price in ETH
    uint256 public constant TOKEN_PRICE = 0.0003 ether;

    // Minimum journalist stake in tokens
    uint256 public constant MIN_STAKE = 0.0003 ether;

    struct UserStake {
        address userAddress;
        uint256 stake;
    }

    struct Article {
        address journalist;
        string articleTitle;
        string contentHash;
        string[] refImages;
        bool verified;
        uint256 realVotes;
        uint256 fakeVotes;
        address[] voters;
        bool isDeleted;
    }

    mapping(address => uint256) public stakes;
    address[] public stakers;

    // Mapping from contentHash to Article
    mapping(string => Article) public articles;
    // Mapping from journalist address to their article contentHashes
    mapping(address => string[]) public journalistArticles;
    // Check if contentHash exists
    mapping(string => bool) public contentHashExists;

    event TokenPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 ethPaid
    );
    event StakeUpdated(address indexed user, uint256 newStake);
    event ArticleCreated(
        address indexed journalist,
        string articleTitle,
        string contentHash,
        string[] refImages
    );
    event ArticleUpdated(
        address indexed journalist,
        string articleTitle,
        string contentHash,
        string[] refImages
    );

    constructor() ERC20("DeNews Token", "DNT") Ownable(msg.sender) {
        _mint(address(this), 1000000 * 10 ** 18);
    }

    modifier onlyJournalist() {
        require(stakes[msg.sender] >= MIN_STAKE, "Not a journalist.");
        _;
    }

    function buyToken() external payable {
        require(msg.value >= TOKEN_PRICE, "Insufficient ETH.");

        uint256 tokensToBuy = 1 * 10 ** 18; // 1 DNT per ETH
        require(balanceOf(address(this)) >= tokensToBuy, "Not enough tokens.");

        _transfer(address(this), msg.sender, tokensToBuy);

        if (stakes[msg.sender] == 0) {
            stakers.push(msg.sender);
        }
        stakes[msg.sender] += tokensToBuy;

        // Refund excess ETH
        if (msg.value > TOKEN_PRICE) {
            payable(msg.sender).transfer(msg.value - TOKEN_PRICE);
        }

        emit TokenPurchased(msg.sender, tokensToBuy, msg.value);
        emit StakeUpdated(msg.sender, stakes[msg.sender]);
    }

    function updateArticle(
        string memory _articleTitle,
        string memory _contentHash,
        string[] memory _refImages,
        bool _verified,
        uint256 _realVotes,
        uint256 _fakeVotes,
        address[] memory _voters,
        bool _isDeleted
    ) external {
        if (contentHashExists[_contentHash]) {            
            articles[_contentHash].articleTitle = _articleTitle;
            articles[_contentHash].refImages = _refImages;
            articles[_contentHash].verified = _verified;
            articles[_contentHash].realVotes = _realVotes;
            articles[_contentHash].fakeVotes = _fakeVotes;
            articles[_contentHash].voters = _voters;
            articles[_contentHash].isDeleted = _isDeleted;
            
            emit ArticleUpdated(
                msg.sender,
                _articleTitle,
                _contentHash,
                _refImages
            );
        } else {
            // Create new article
            Article storage article = articles[_contentHash];
            article.journalist = msg.sender;
            article.articleTitle = _articleTitle;
            article.contentHash = _contentHash;
            article.refImages = _refImages;
            article.verified = _verified;
            article.realVotes = _realVotes;
            article.fakeVotes = _fakeVotes;
            article.voters = _voters;
            article.isDeleted = _isDeleted;
            
            contentHashExists[_contentHash] = true;
            journalistArticles[msg.sender].push(_contentHash);

            emit ArticleCreated(
                msg.sender,
                _articleTitle,
                _contentHash,
                _refImages
            );
        }
    }

    function getAllArticlesOfJournalist(address _journalist) external view returns (Article[] memory) {
        string[] memory journalistHashes = journalistArticles[_journalist];
        Article[] memory journalistArticlesList = new Article[](journalistHashes.length);
        
        for (uint256 i = 0; i < journalistHashes.length; i++) {
            journalistArticlesList[i] = articles[journalistHashes[i]];
        }
        
        return journalistArticlesList;
    }

    function getArticle(string memory _contentHash) external view returns (Article memory) {
        require(contentHashExists[_contentHash], "Article not found.");
        return articles[_contentHash];
    }

    function getUserDetails(address _user) external view returns (UserStake memory) {
        return UserStake({userAddress: _user, stake: stakes[_user]});
    }

    function getStakeBalance(address _user) external view returns (uint256) {
        return stakes[_user];
    }

    function getTokenPrice() external pure returns (uint256) {
        return TOKEN_PRICE;
    }

    function getAllStakers() external view returns (address[] memory) {
        return stakers;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Get number of articles by a journalist
    function getJournalistArticleCount(address _journalist) external view returns (uint256) {
        return journalistArticles[_journalist].length;
    }

    // Check if content hash exists
    function doesContentHashExist(string memory _contentHash) external view returns (bool) {
        return contentHashExists[_contentHash];
    }

    // Owner can withdraw ETH
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}