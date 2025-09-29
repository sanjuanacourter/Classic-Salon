// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint32, euint64, euint256, externalEuint32, externalEuint64, externalEuint256} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title ClassicSalon – 世界名著鉴赏（FHE 版）
/// @notice 以 FHE 加密存储鼓掌（点赞）与题材投票，面向世界名著的链上鉴赏与榜单。
contract ClassicSalon is SepoliaConfig {
    struct ClassicWork {
        uint256 id;                    // 作品 ID
        address contributor;           // 投稿者地址
        string title;                  // 名著标题
        string synopsisHash;           // 简介哈希（IPFS/Arweave 等）
        string contentHash;            // 资源哈希（封面/插图等）
        string[] tags;                 // 标签
        string[] genres;               // 题材/流派（用于榜单）
        euint32 applauseEnc;           // 加密的鼓掌计数
        uint64 timestamp;              // 收录时间
    }

    // 自增 ID
    uint256 public nextWorkId = 1;

    // 存储
    mapping(uint256 => ClassicWork) private _works;
    uint256[] private _workIds;

    // 题材投票（按作品与题材聚合）
    mapping(uint256 => mapping(bytes32 => euint32)) private _endorsementsByWorkAndGenre;
    mapping(uint256 => mapping(bytes32 => bool)) private _endorsementsInitialized;

    // 事件
    event WorkSubmitted(uint256 indexed workId, address indexed contributor, string title);
    event WorkApplauded(uint256 indexed workId, address indexed reader);
    event WorkEndorsed(uint256 indexed workId, address indexed reader, string genre);

    /// @notice 提交名著作品；初始化鼓掌计数为 0，并授权合约与投稿者。
    function submitWork(
        string calldata title,
        string calldata synopsisHash,
        string calldata contentHash,
        string[] calldata tags,
        string[] calldata genres
    ) external returns (uint256 workId) {
        workId = nextWorkId++;

        euint32 applause = FHE.asEuint32(0);

        ClassicWork storage w = _works[workId];
        w.id = workId;
        w.contributor = msg.sender;
        w.title = title;
        w.synopsisHash = synopsisHash;
        w.contentHash = contentHash;
        w.timestamp = uint64(block.timestamp);
        w.applauseEnc = applause;

        for (uint256 i = 0; i < tags.length; i++) {
            w.tags.push(tags[i]);
        }

        for (uint256 i = 0; i < genres.length; i++) {
            w.genres.push(genres[i]);
        }

        // ACL 授权：合约与投稿者可解密
        FHE.allowThis(w.applauseEnc);
        FHE.allow(w.applauseEnc, msg.sender);

        _workIds.push(workId);

        emit WorkSubmitted(workId, msg.sender, title);
    }

    /// @notice 为名著鼓掌（加密计数 +1）。
    function applaudWork(uint256 workId) external {
        ClassicWork storage w = _works[workId];
        require(w.contributor != address(0), "Work not found");

        w.applauseEnc = FHE.add(w.applauseEnc, 1);

        FHE.allowThis(w.applauseEnc);
        FHE.allow(w.applauseEnc, w.contributor);
        FHE.allowTransient(w.applauseEnc, msg.sender);

        emit WorkApplauded(workId, msg.sender);
    }

    /// @notice 按题材为名著背书（投票 +1）。仅允许作品所属题材。
    function endorseWorkInGenre(uint256 workId, string calldata genre) external {
        ClassicWork storage w = _works[workId];
        require(w.contributor != address(0), "Work not found");

        bool belongs = false;
        for (uint256 i = 0; i < w.genres.length; i++) {
            if (keccak256(bytes(w.genres[i])) == keccak256(bytes(genre))) {
                belongs = true;
                break;
            }
        }
        require(belongs, "Work does not belong to this genre");

        bytes32 key = keccak256(bytes(genre));
        euint32 current = _endorsementsByWorkAndGenre[workId][key];
        if (!_endorsementsInitialized[workId][key]) {
            current = FHE.asEuint32(0);
            _endorsementsInitialized[workId][key] = true;
        }
        current = FHE.add(current, 1);
        _endorsementsByWorkAndGenre[workId][key] = current;

        FHE.allowThis(current);
        FHE.allow(current, w.contributor);
        FHE.allowTransient(current, msg.sender);

        emit WorkEndorsed(workId, msg.sender, genre);
    }

    /// @notice 读取作品元数据与鼓掌计数句柄。
    function readWork(uint256 workId)
        external
        view
        returns (
            uint256 id,
            address contributor,
            string memory title,
            string memory synopsisHash,
            string memory contentHash,
            string[] memory tags,
            string[] memory genres,
            uint64 timestamp,
            euint32 applauseHandle
        )
    {
        ClassicWork storage w = _works[workId];
        require(w.contributor != address(0), "Work not found");
        return (
            w.id,
            w.contributor,
            w.title,
            w.synopsisHash,
            w.contentHash,
            w.tags,
            w.genres,
            w.timestamp,
            w.applauseEnc
        );
    }

    /// @notice 列出全部作品 ID。
    function listAllWorks() external view returns (uint256[] memory ids) {
        return _workIds;
    }

    /// @notice 获取题材背书计数句柄。
    function readEndorsements(uint256 workId, string calldata genre) external view returns (euint32 votesHandle) {
        bytes32 key = keccak256(bytes(genre));
        return _endorsementsByWorkAndGenre[workId][key];
    }
}




