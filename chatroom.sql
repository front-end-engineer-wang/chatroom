/*
Navicat MySQL Data Transfer

Source Server         : node
Source Server Version : 80026
Source Host           : localhost:3306
Source Database       : 聊天系统

Target Server Type    : MYSQL
Target Server Version : 80026
File Encoding         : 65001

Date: 2022-03-29 01:50:54
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for chatroom
-- ----------------------------
DROP TABLE IF EXISTS `chatroom`;
CREATE TABLE `chatroom` (
  `room_id` bigint NOT NULL AUTO_INCREMENT,
  `room_name` varchar(255) DEFAULT NULL,
  `room_creat` bigint DEFAULT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of chatroom
-- ----------------------------

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `user_id` bigint DEFAULT NULL,
  `user_friend` bigint DEFAULT NULL,
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `friend_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  KEY `friend` (`user_id`),
  KEY `friend2` (`user_friend`),
  CONSTRAINT `friend` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `friend2` FOREIGN KEY (`user_friend`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of friend
-- ----------------------------
INSERT INTO `friend` VALUES ('14', '13', 'lww', 'wcq');
INSERT INTO `friend` VALUES ('13', '14', 'wcq', 'lww');

-- ----------------------------
-- Table structure for message_friends
-- ----------------------------
DROP TABLE IF EXISTS `message_friends`;
CREATE TABLE `message_friends` (
  `message_id` bigint NOT NULL AUTO_INCREMENT,
  `message_sent` bigint NOT NULL,
  `message_receive` bigint NOT NULL,
  `message_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message_type` varchar(255) NOT NULL,
  `message_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of message_friends
-- ----------------------------
INSERT INTO `message_friends` VALUES ('33', '13', '14', 'w', 'text', '2022-03-29 01:48:06');
INSERT INTO `message_friends` VALUES ('34', '14', '13', 'hello', 'text', '2022-03-29 01:48:17');
INSERT INTO `message_friends` VALUES ('35', '13', '14', '很开心', 'text', '2022-03-29 01:48:24');

-- ----------------------------
-- Table structure for message_room
-- ----------------------------
DROP TABLE IF EXISTS `message_room`;
CREATE TABLE `message_room` (
  `message_id` bigint NOT NULL AUTO_INCREMENT,
  `message_sent` bigint DEFAULT NULL,
  `message_receive` bigint DEFAULT NULL,
  `message_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `message_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of message_room
-- ----------------------------

-- ----------------------------
-- Table structure for request
-- ----------------------------
DROP TABLE IF EXISTS `request`;
CREATE TABLE `request` (
  `request_id` bigint NOT NULL AUTO_INCREMENT,
  `request_send` varchar(30) DEFAULT NULL,
  `request_accept` varchar(30) DEFAULT NULL,
  `request_status` int DEFAULT NULL,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of request
-- ----------------------------
INSERT INTO `request` VALUES ('19', 'lww', 'wcq', '2');

-- ----------------------------
-- Table structure for roomuser
-- ----------------------------
DROP TABLE IF EXISTS `roomuser`;
CREATE TABLE `roomuser` (
  `room_id` bigint NOT NULL,
  `user_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of roomuser
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_name` varchar(30) NOT NULL,
  `user_password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `user_img` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('wcq', '123', '13', '13');
INSERT INTO `user` VALUES ('lww', '123', '14', '14');
