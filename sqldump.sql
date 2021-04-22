-- -------------------------------------------------------------
-- TablePlus 3.12.6(366)
--
-- https://tableplus.com/
--
-- Database: search
-- Generation Time: 2021-04-22 05:03:05.1780
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `website_titles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `website_titles_url_hash_idx` (`url_hash`) USING BTREE,
  FULLTEXT KEY `ft_idx` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `website_titles` (`id`, `title`, `url`, `url_hash`, `created_at`, `updated_at`) VALUES
(1, 'google', 'https://www.google.com/', 'K2gcCiS6/4iZ1xY8x/gFx14fROQ=', '2021-04-22 01:26:37', '2021-04-22 02:52:10'),
(3, 'googly', 'https://www.google.com/', 'K2gcCiS6/4iZ1xY8x/gRx14fROQ=', '2021-04-22 01:26:37', '2021-04-22 02:37:52'),
(4, 'Edge - Templating engine with fresh air', 'https://edge.adonisjs.com/docs/getting-started', 'TNzZcwGL0JkMf0f4IQFgzq5fDrU=', '2021-04-22 03:00:10', '2021-04-22 03:00:10'),
(5, 'MySQL SOUNDS LIKE - w3resource', 'https://www.w3resource.com/mysql/string-functions/mysql-sounds_like-function.php', 'lywayRrkOLdL6LJ7vM8xMLcTdrE=', '2021-04-22 03:00:11', '2021-04-22 03:00:11'),
(6, 'What is the fastest node.js hashing algorithm | by Chris Thompson | Medium', 'https://medium.com/@chris_72272/what-is-the-fastest-node-js-hashing-algorithm-c15c1a0e164e', '8K9x/1Avj0OxsNX3aKgh3ZToT+4=', '2021-04-22 03:00:12', '2021-04-22 03:00:12');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;