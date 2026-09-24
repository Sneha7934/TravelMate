-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2026 at 10:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;
SET SESSION sql_require_primary_key = 0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Clean existing tables if re-seeding
--
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `attractions`;
DROP TABLE IF EXISTS `destinations`;
DROP TABLE IF EXISTS `users`;

--
-- Database: `travelmate`
--

-- --------------------------------------------------------

--
-- Table structure for table `attractions`
--

CREATE TABLE `attractions` (
  `id` bigint(20) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `entry_fee` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `destination_id` bigint(20) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attractions`
--

INSERT INTO `attractions` (`id`, `description`, `entry_fee`, `image_url`, `location`, `name`, `destination_id`, `latitude`, `longitude`) VALUES
(154, 'Baga Beach is one of Goa\'s most popular beaches, known for sandy shores, water sports, restaurants and vibrant nightlife.', 'Free', 'baga-beach.jpg', 'North Goa', 'Baga Beach', 52, 15.555439, 73.751569),
(155, 'A historic Portuguese fort overlooking the Arabian Sea, known for its lighthouse and scenic coastal views.', '₹25', 'fort-aguada.jpg', 'Candolim, Goa', 'Fort Aguada', 52, 15.492288, 73.773647),
(156, 'Dudhsagar Falls is a spectacular four-tiered waterfall surrounded by the lush forests of the Western Ghats.', '₹500', 'dudhsagar.jpg', 'Mollem, Goa', 'Dudhsagar Falls', 52, 15.312778, 74.314167),
(157, 'Amber Fort is a magnificent hilltop fort famous for its grand palaces, courtyards, artistic architecture and panoramic views.', '₹100', 'amber-fort.jpg', 'Amer, Jaipur', 'Amber Fort', 53, 26.9859, 75.8507),
(158, 'Hawa Mahal is an iconic five-story palace famous for its intricate honeycomb-style windows and pink sandstone architecture.', '₹50', 'hawa-mahal.jpg', 'Jaipur, Rajasthan', 'Hawa Mahal', 53, 26.924, 75.82672),
(159, 'The City Palace is a grand royal complex featuring courtyards, museums, palaces and beautiful Rajasthani architecture.', '₹300', 'city-palace-jaipur.jpg', 'Jaipur, Rajasthan', 'City Palace', 53, 26.9258, 75.8236),
(160, 'Lake Pichola is a beautiful artificial lake surrounded by palaces, temples, hills and historic buildings.', 'Boat ride charges apply', 'lake-pichola.jpg', 'Udaipur, Rajasthan', 'Lake Pichola', 54, 24.571944, 73.678889),
(161, 'The City Palace is a magnificent royal complex overlooking Lake Pichola and showcasing the heritage of Mewar.', '₹400', 'city-palace-udaipur.jpg', 'Udaipur, Rajasthan', 'City Palace Udaipur', 54, 24.58, 73.68),
(162, 'Sajjangarh Palace, also known as the Monsoon Palace, offers spectacular panoramic views of Udaipur and its surrounding hills.', '₹110', 'sajjangarh.jpg', 'Udaipur, Rajasthan', 'Sajjangarh Palace', 54, 24.594, 73.639),
(163, 'Jaisalmer Fort is a magnificent golden sandstone fort and one of India\'s most famous living forts.', 'Free', 'jaisalmer-fort.jpg', 'Jaisalmer, Rajasthan', 'Jaisalmer Fort', 55, 26.9127, 70.9126),
(164, 'Sam Sand Dunes are famous for desert safaris, camel rides, cultural performances and spectacular sunset views.', 'Free', 'sam-sand-dunes.jpg', 'Sam, Jaisalmer', 'Sam Sand Dunes', 55, 26.85, 70.533333),
(165, 'Patwon Ki Haveli is a beautiful collection of historic mansions known for intricate sandstone carvings and traditional architecture.', '₹100', 'patwon-ki-haveli.jpg', 'Jaisalmer, Rajasthan', 'Patwon Ki Haveli', 55, 26.918, 70.9156),
(166, 'Mehrangarh Fort is one of India\'s most impressive forts, featuring massive walls, royal palaces and historical collections.', '₹200', 'mehrangarh-fort.jpg', 'Jodhpur, Rajasthan', 'Mehrangarh Fort', 56, 26.298056, 73.018889),
(167, 'Jaswant Thada is an elegant marble memorial surrounded by peaceful gardens and offering beautiful views of Jodhpur.', '₹30', 'jaswant-thada.jpg', 'Jodhpur, Rajasthan', 'Jaswant Thada', 56, 26.303889, 73.025278),
(168, 'Umaid Bhawan Palace is a grand royal residence known for its magnificent architecture and museum showcasing royal history.', '₹100', 'umaid-bhawan.jpg', 'Jodhpur, Rajasthan', 'Umaid Bhawan Palace', 56, 26.280833, 73.046944),
(169, 'The Taj Mahal is one of the world\'s most famous monuments, renowned for its white marble architecture and Mughal heritage.', '₹50', 'taj-mahal.jpg', 'Agra, Uttar Pradesh', 'Taj Mahal', 57, 27.175278, 78.042222),
(170, 'Agra Fort is a massive red sandstone fortress featuring magnificent palaces, halls and historic Mughal architecture.', '₹50', 'agra-fort.jpg', 'Agra, Uttar Pradesh', 'Agra Fort', 57, 27.179583, 78.021297),
(171, 'Mehtab Bagh is a historic garden across the Yamuna River offering beautiful views of the Taj Mahal.', '₹25', 'mehtab-bagh.jpg', 'Agra, Uttar Pradesh', 'Mehtab Bagh', 57, 27.179722, 78.041944),
(172, 'Dashashwamedh Ghat is one of Varanasi\'s most famous ghats and is known for its spectacular evening Ganga Aarti.', 'Free', 'dashashwamedh-ghat.jpg', 'Varanasi, Uttar Pradesh', 'Dashashwamedh Ghat', 58, 25.306944, 83.010556),
(173, 'Kashi Vishwanath Temple is one of the most important Hindu temples dedicated to Lord Shiva.', 'Free', 'kashi-vishwanath.jpg', 'Varanasi, Uttar Pradesh', 'Kashi Vishwanath Temple', 58, 25.3109, 83.0107),
(174, 'Sarnath is an important Buddhist pilgrimage site where Gautama Buddha is believed to have delivered his first sermon.', '₹25', 'sarnath.jpg', 'Sarnath, Varanasi', 'Sarnath', 58, 25.3811, 83.0227),
(175, 'Ram Mandir is a major pilgrimage destination dedicated to Lord Ram and an important religious landmark in Ayodhya.', 'Free', 'ram-mandir.jpg', 'Ayodhya, Uttar Pradesh', 'Ram Mandir', 59, 26.7956, 82.1998),
(176, 'Hanuman Garhi is a famous temple dedicated to Lord Hanuman located on a hilltop in the heart of Ayodhya.', 'Free', 'hanuman-garhi.jpg', 'Ayodhya, Uttar Pradesh', 'Hanuman Garhi', 59, 26.7997, 82.2043),
(177, 'Saryu Ghat is a peaceful riverside destination known for evening aarti ceremonies and religious activities.', 'Free', 'saryu-ghat.jpg', 'Ayodhya, Uttar Pradesh', 'Saryu Ghat', 59, 26.7926, 82.199),
(178, 'India Gate is a famous war memorial and one of Delhi\'s most recognizable landmarks.', 'Free', 'india-gate.jpg', 'New Delhi', 'India Gate', 60, 28.612778, 77.229167),
(179, 'The Red Fort is a historic Mughal fortress famous for its red sandstone walls and magnificent architecture.', '₹35', 'red-fort.jpg', 'Old Delhi', 'Red Fort', 60, 28.655833, 77.240278),
(180, 'Qutub Minar is a UNESCO World Heritage Site and one of India\'s most famous examples of medieval Indo-Islamic architecture.', '₹35', 'qutub-minar.jpg', 'Mehrauli, Delhi', 'Qutub Minar', 60, 28.524361, 77.18525),
(181, 'The Gateway of India is an iconic waterfront monument overlooking the Arabian Sea.', 'Free', 'gateway-of-india.jpg', 'Mumbai, Maharashtra', 'Gateway of India', 61, 18.921806, 72.834694),
(182, 'Marine Drive is a famous coastal boulevard known for its sea views, skyline and beautiful evening atmosphere.', 'Free', 'marine-drive.jpg', 'South Mumbai', 'Marine Drive', 61, 18.944, 72.823),
(183, 'The Elephanta Caves are ancient rock-cut temples famous for their sculptures and historic religious art.', '₹40', 'elephanta-caves.jpg', 'Elephanta Island, Mumbai', 'Elephanta Caves', 61, 18.963333, 72.931389),
(184, 'Shaniwar Wada is a historic fortification that was once the seat of the Peshwas of the Maratha Empire.', '₹25', 'shaniwar-wada.jpg', 'Pune, Maharashtra', 'Shaniwar Wada', 62, 18.519167, 73.855278),
(185, 'Aga Khan Palace is a historic landmark associated with India\'s freedom movement and Mahatma Gandhi.', '₹250', 'aga-khan-palace.jpg', 'Pune, Maharashtra', 'Aga Khan Palace', 62, 18.553056, 73.9),
(186, 'Sinhagad Fort is a historic hill fort known for its Maratha history, trekking trails and scenic mountain views.', '₹20', 'sinhagad-fort.jpg', 'Pune, Maharashtra', 'Sinhagad Fort', 62, 18.3663, 73.7559),
(187, 'Tiger Hill is famous for spectacular sunrise views over Kanchenjunga and the surrounding Himalayan peaks.', '₹50', 'tiger-hill.jpg', 'Darjeeling, West Bengal', 'Tiger Hill', 63, 26.9974589, 88.294495),
(188, 'The Darjeeling Himalayan Railway is a historic mountain railway famous for its scenic routes and toy train journeys.', 'Varies by train', 'darjeeling-toy-train.jpg', 'Darjeeling, West Bengal', 'Darjeeling Himalayan Railway', 63, 27.045, 88.267222),
(189, 'Batasia Loop is a scenic railway loop offering panoramic views of Darjeeling and the Himalayan mountains.', '₹20', 'batasia-loop.jpg', 'Darjeeling, West Bengal', 'Batasia Loop', 63, 27.016667, 88.247222),
(190, 'Victoria Memorial is a magnificent marble monument surrounded by gardens and houses a museum of Kolkata\'s history.', '₹30', 'victoria-memorial.jpg', 'Kolkata, West Bengal', 'Victoria Memorial', 64, 22.5448, 88.3426),
(191, 'Howrah Bridge is an iconic cantilever bridge over the Hooghly River and one of Kolkata\'s most recognizable landmarks.', 'Free', 'howrah-bridge.jpg', 'Kolkata, West Bengal', 'Howrah Bridge', 64, 22.5851, 88.3468),
(192, 'The Indian Museum is one of India\'s oldest museums and houses extensive collections of art, archaeology and natural history.', '₹75', 'indian-museum.jpg', 'Kolkata, West Bengal', 'Indian Museum', 64, 22.557, 88.3506),
(193, 'Jagannath Temple is one of India\'s most important Hindu pilgrimage sites and is famous for the annual Rath Yatra.', 'Free', 'jagannath-temple.jpg', 'Puri, Odisha', 'Jagannath Temple', 65, 19.804722, 85.818333),
(194, 'Puri Beach is a popular coastal destination known for its golden sand, Bay of Bengal views and lively atmosphere.', 'Free', 'puri-beach.jpeg', 'Puri, Odisha', 'Puri Beach', 65, 19.7985, 85.8249),
(195, 'Raghurajpur is a traditional crafts village famous for Pattachitra paintings and other forms of Odisha handicrafts.', 'Free', 'raghurajpur.jpg', 'Puri District, Odisha', 'Raghurajpur Artist Village', 65, 19.8827, 85.836),
(196, 'Lingaraj Temple is one of Odisha\'s most important temples and a remarkable example of Kalinga architecture.', 'Free', 'lingaraj-temple.jpg', 'Bhubaneswar, Odisha', 'Lingaraj Temple', 66, 20.2508, 85.833),
(197, 'These ancient rock-cut caves contain historic sculptures, inscriptions and remnants of Jain heritage.', '₹15', 'udayagiri-khandagiri.jpg', 'Bhubaneswar, Odisha', 'Udayagiri and Khandagiri Caves', 66, 20.2578, 85.7756),
(198, 'Dhauli Shanti Stupa is a peaceful Buddhist monument located on a hill overlooking the Daya River.', 'Free', 'dhauli-shanti-stupa.jpg', 'Bhubaneswar, Odisha', 'Dhauli Shanti Stupa', 66, 20.1926, 85.839),
(199, 'The Konark Sun Temple is a UNESCO World Heritage Site famous for its magnificent stone architecture and detailed carvings.', '₹40', 'konark-sun-temple.jpg', 'Konark, Odisha', 'Konark Sun Temple', 67, 19.887444, 86.094596),
(200, 'Chandrabhaga Beach is a scenic beach near Konark known for sunrise views and its peaceful coastal environment.', 'Free', 'chandrabhaga-beach.jpg', 'Konark, Odisha', 'Chandrabhaga Beach', 67, 19.8269, 86.1037),
(201, 'The Konark Archaeological Museum contains sculptures and artifacts associated with the famous Sun Temple.', '₹10', 'konark-museum.jpg', 'Konark, Odisha', 'Archaeological Museum Konark', 67, 19.8846, 86.0941),
(202, 'Dal Lake is famous for its houseboats, shikaras, floating markets and beautiful Himalayan surroundings.', 'Free', 'dal-lake.jpg', 'Srinagar, Jammu and Kashmir', 'Dal Lake', 68, 34.1015, 74.88),
(203, 'The Mughal Gardens of Srinagar are famous for terraced landscapes, fountains and beautiful views of the surrounding mountains.', '₹24', 'mughal-gardens.jpg', 'Srinagar, Jammu and Kashmir', 'Mughal Gardens', 68, 34.1367, 74.87),
(204, 'Shankaracharya Temple is an ancient hilltop temple offering panoramic views over Srinagar and Dal Lake.', 'Free', 'shankaracharya-temple.jpg', 'Srinagar, Jammu and Kashmir', 'Shankaracharya Temple', 68, 34.0576, 74.891),
(205, 'Gulmarg Gondola is one of the world\'s highest cable car systems and offers spectacular mountain views.', 'Varies by phase', 'gulmarg-gondola.jpeg', 'Gulmarg, Jammu and Kashmir', 'Gulmarg Gondola', 69, 34.0484, 74.3805),
(206, 'Gulmarg is a renowned skiing destination known for deep snow, mountain slopes and winter adventure activities.', 'Activity charges apply', 'gulmarg-skiing.jpg', 'Gulmarg, Jammu and Kashmir', 'Gulmarg Ski Resort', 69, 34.0484, 74.3805),
(207, 'Alpather Lake is a scenic high-altitude lake surrounded by rocky mountains and alpine landscapes.', 'Free', 'alpather-lake.jpg', 'Gulmarg, Jammu and Kashmir', 'Alpather Lake', 69, 34.02, 74.39),
(208, 'Betaab Valley is famous for lush green meadows, clear streams and dramatic Himalayan scenery.', '₹100', 'betaab-valley.jpg', 'Pahalgam, Jammu and Kashmir', 'Betaab Valley', 70, 34.024, 75.335),
(209, 'Aru Valley is a picturesque Himalayan valley known for meadows, forests, trekking trails and mountain views.', 'Local charges apply', 'aru-valley.jpg', 'Pahalgam, Jammu and Kashmir', 'Aru Valley', 70, 34.033, 75.378),
(210, 'The Lidder River flows through Pahalgam and is known for its crystal-clear waters, scenic surroundings and adventure activities.', 'Free', 'lidder-river.jpg', 'Pahalgam, Jammu and Kashmir', 'Lidder River', 70, 34.016, 75.32),
(211, 'Leh Palace is a historic royal palace offering panoramic views of Leh town and the surrounding Himalayan mountains.', '₹25', 'leh-palace.jpg', 'Leh, Ladakh', 'Leh Palace', 71, 34.165, 77.584),
(212, 'Shanti Stupa is a beautiful white-domed Buddhist monument offering spectacular views of Leh and the surrounding mountains.', 'Free', 'shanti-stupa.jpg', 'Leh, Ladakh', 'Shanti Stupa', 71, 34.1526, 77.5771),
(213, 'Thiksey Monastery is a stunning Buddhist monastery known for its architecture, prayer halls and large Maitreya Buddha statue.', '₹50', 'thiksey-monastery.jpeg', 'Thiksey, Ladakh', 'Thiksey Monastery', 71, 34.052, 77.667),
(214, 'Diskit Monastery is the oldest and largest monastery in Nubra Valley and is famous for its massive Buddha statue.', '₹30', 'diskit-monastery.jpg', 'Nubra Valley, Ladakh', 'Diskit Monastery', 72, 35.198, 77.55),
(215, 'Hunder Sand Dunes are famous for their unusual high-altitude desert landscape and Bactrian camel rides.', 'Free', 'hunder-sand-dunes.jpg', 'Hunder, Nubra Valley', 'Hunder Sand Dunes', 72, 35.42, 77.59),
(216, 'Panamik is known for natural hot springs surrounded by dramatic Himalayan landscapes.', 'Local charges apply', 'panamik-hot-springs.jpg', 'Nubra Valley, Ladakh', 'Panamik Hot Springs', 72, 35.613, 77.995),
(217, 'Pangong Lake is famous for its stunning blue waters, surrounding mountains and spectacular high-altitude landscape.', 'Permit required', 'pangong-lake.jpg', 'Ladakh', 'Pangong Lake', 73, 33.7595, 78.6675),
(218, 'The Pangong Lake viewpoints offer breathtaking views of the changing colors of the lake and surrounding mountains.', 'Free', 'pangong-viewpoint.jpg', 'Pangong, Ladakh', 'Pangong Lake Viewpoint', 73, 33.739, 78.676),
(219, 'Lukung is a scenic village near Pangong Lake offering spectacular views of the lake and surrounding mountains.', 'Free', 'lukung.jpg', 'Pangong, Ladakh', 'Lukung Village', 73, 33.826, 78.734),
(220, 'Solang Valley is famous for snow activities, paragliding, mountain views and adventure sports.', 'Free', 'solang-valley.jpg', 'Manali, Himachal Pradesh', 'Solang Valley', 74, 32.312, 77.159),
(221, 'Rohtang Pass is famous for snow-covered landscapes, high mountain scenery and adventurous road trips.', 'Permit required', 'rohtang-pass.jpg', 'Near Manali, Himachal Pradesh', 'Rohtang Pass', 74, 32.3726, 77.2488),
(222, 'Hadimba Temple is an ancient wooden temple surrounded by cedar forests and dedicated to Goddess Hadimba.', 'Free', 'hadimba-temple.jpg', 'Manali, Himachal Pradesh', 'Hadimba Temple', 74, 32.2467, 77.1784),
(223, 'The Ridge is a popular open space in Shimla offering mountain views and access to several major attractions.', 'Free', 'the-ridge-shimla.jpg', 'Shimla, Himachal Pradesh', 'The Ridge', 75, 31.1048, 77.1734),
(224, 'Mall Road is Shimla\'s famous shopping and leisure area filled with shops, restaurants and colonial-era buildings.', 'Free', 'mall-road-shimla.jpg', 'Shimla, Himachal Pradesh', 'Mall Road', 75, 31.103, 77.177),
(225, 'Jakhu Temple is a hilltop temple dedicated to Lord Hanuman and is known for its giant Hanuman statue.', 'Free', 'jakhu-temple.jpg', 'Shimla, Himachal Pradesh', 'Jakhu Temple', 75, 31.1047, 77.1826),
(226, 'McLeod Ganj is famous for Tibetan culture, monasteries, mountain views and its connection with the Dalai Lama.', 'Free', 'mcleod-ganj.jpg', 'Dharamshala, Himachal Pradesh', 'McLeod Ganj', 76, 32.2426, 76.3213),
(227, 'Namgyal Monastery is an important Tibetan Buddhist monastery known for its peaceful atmosphere and spiritual significance.', 'Free', 'namgyal-monastery.jpg', 'McLeod Ganj, Dharamshala', 'Namgyal Monastery', 76, 32.2396, 76.3265),
(228, 'Triund is a popular Himalayan trekking destination offering spectacular views of the Dhauladhar mountain range.', 'Free', 'triund.jpg', 'Dharamshala, Himachal Pradesh', 'Triund', 76, 32.2816, 76.3445),
(229, 'Laxman Jhula is a famous suspension bridge and landmark associated with the spiritual heritage of Rishikesh.', 'Free', 'laxman-jhula.jpg', 'Rishikesh, Uttarakhand', 'Laxman Jhula', 77, 30.1286, 78.3247),
(230, 'Triveni Ghat is a sacred riverside location famous for its evening Ganga Aarti.', 'Free', 'triveni-ghat.jpg', 'Rishikesh, Uttarakhand', 'Triveni Ghat', 77, 30.105, 78.2935),
(231, 'River rafting on the Ganges is one of Rishikesh\'s most popular adventure activities.', '₹500 - ₹2,000', 'rishikesh-rafting.jpg', 'Rishikesh, Uttarakhand', 'River Rafting', 77, 30.0869, 78.2676),
(232, 'Naini Lake is a beautiful natural lake surrounded by hills and is the centerpiece of Nainital.', 'Boating charges apply', 'naini-lake.jpg', 'Nainital, Uttarakhand', 'Naini Lake', 78, 29.3919, 79.4542),
(233, 'Naina Devi Temple is a famous Hindu temple located beside Naini Lake.', 'Free', 'naina-devi-temple.jpg', 'Nainital, Uttarakhand', 'Naina Devi Temple', 78, 29.3945, 79.456),
(234, 'Snow View Point offers panoramic views of the Himalayan peaks surrounding Nainital.', 'Free', 'snow-view-point.jpg', 'Nainital, Uttarakhand', 'Snow View Point', 78, 29.3997, 79.463),
(235, 'Kempty Falls is one of Mussoorie\'s most popular waterfalls surrounded by scenic mountain landscapes.', 'Free', 'kempty-falls.jpg', 'Mussoorie, Uttarakhand', 'Kempty Falls', 79, 30.492, 78.03),
(236, 'Mall Road is a lively shopping and walking area filled with restaurants, shops and beautiful mountain views.', 'Free', 'mall-road-mussoorie.jpg', 'Mussoorie, Uttarakhand', 'Mall Road Mussoorie', 79, 30.4598, 78.0664),
(237, 'Gun Hill is a popular viewpoint offering panoramic views of Mussoorie and the surrounding Himalayan ranges.', 'Cable car charges apply', 'gun-hill.jpg', 'Mussoorie, Uttarakhand', 'Gun Hill', 79, 30.4605, 78.0718),
(238, 'Har Ki Pauri is Haridwar\'s most famous ghat and a major location for the evening Ganga Aarti.', 'Free', 'har-ki-pauri.jpg', 'Haridwar, Uttarakhand', 'Har Ki Pauri', 80, 29.956, 78.17),
(239, 'Mansa Devi Temple is a famous hilltop pilgrimage site accessible by trekking or cable car.', 'Free', 'mansa-devi.jpg', 'Haridwar, Uttarakhand', 'Mansa Devi Temple', 80, 29.95, 78.171),
(240, 'Chandi Devi Temple is a revered temple situated on a hill overlooking Haridwar and the Ganges.', 'Free', 'chandi-devi.jpg', 'Haridwar, Uttarakhand', 'Chandi Devi Temple', 80, 29.927, 78.171),
(241, 'The Alappuzha backwaters are famous for peaceful waterways, traditional houseboats and beautiful tropical landscapes.', 'Boat charges apply', 'alleppey-backwaters.jpg', 'Alappuzha, Kerala', 'Alleppey Backwaters', 81, 9.4981, 76.3388),
(242, 'Kovalam is a famous beach destination known for its palm-lined shores, lighthouse and Arabian Sea views.', 'Free', 'kovalam-beach.jpg', 'Thiruvananthapuram, Kerala', 'Kovalam Beach', 81, 8.4, 76.978),
(243, 'Periyar Wildlife Sanctuary is famous for wildlife, forests, elephants, boating and scenic natural surroundings.', 'Varies', 'periyar.jpg', 'Thekkady, Kerala', 'Periyar Wildlife Sanctuary', 81, 9.462, 77.236),
(244, 'Munnar\'s tea gardens are famous for their rolling green landscapes and picturesque mountain surroundings.', 'Varies', 'munnar-tea-gardens.jpg', 'Munnar, Kerala', 'Munnar Tea Gardens', 82, 10.0889, 77.0595),
(245, 'Eravikulam National Park is famous for mountain landscapes, wildlife and the rare Neelakurinji flowers.', '₹200', 'eravikulam.jpg', 'Munnar, Kerala', 'Eravikulam National Park', 82, 10.183, 77.05),
(246, 'Mattupetty Dam is a popular scenic attraction surrounded by green hills, forests and a beautiful reservoir.', '₹10', 'mattupetty-dam.jpg', 'Munnar, Kerala', 'Mattupetty Dam', 82, 10.105, 77.118),
(247, 'Alappuzha Beach is a scenic coastal attraction known for its long shoreline and historic pier.', 'Free', 'alappuzha-beach.jpg', 'Alappuzha, Kerala', 'Alappuzha Beach', 83, 9.485, 76.322),
(248, 'Alappuzha Lighthouse is a historic lighthouse offering panoramic views of the Arabian Sea and surrounding city.', '₹20', 'alappuzha-lighthouse.jpg', 'Alappuzha, Kerala', 'Alappuzha Lighthouse', 83, 9.49, 76.327),
(249, 'Kuttanad is famous for its scenic paddy fields, waterways, traditional villages and unique below-sea-level farming.', 'Free', 'kuttanad.jpg', 'Alappuzha, Kerala', 'Kuttanad', 83, 9.4, 76.52),
(250, 'Ooty Lake is a popular attraction surrounded by green hills and known for boating and scenic views.', '₹15', 'ooty-lake.jpg', 'Ooty, Tamil Nadu', 'Ooty Lake', 84, 11.404, 76.693),
(251, 'The Nilgiri Mountain Railway is a historic toy train route famous for its scenic journey through the Nilgiri hills.', 'Varies', 'nilgiri-railway.jpg', 'Ooty, Tamil Nadu', 'Nilgiri Mountain Railway', 84, 11.4064, 76.6932),
(252, 'The Government Botanical Gardens are famous for their extensive collection of plants, flowers and landscaped gardens.', '₹50', 'ooty-botanical-gardens.jpg', 'Ooty, Tamil Nadu', 'Botanical Gardens', 84, 11.4189, 76.711),
(253, 'Marina Beach is one of India\'s longest urban beaches and a major attraction along Chennai\'s coastline.', 'Free', 'marina-beach.jpeg', 'Chennai, Tamil Nadu', 'Marina Beach', 85, 13.05, 80.2824),
(254, 'Kapaleeshwarar Temple is a famous Dravidian-style temple dedicated to Lord Shiva.', 'Free', 'kapaleeshwarar-temple.jpg', 'Chennai, Tamil Nadu', 'Kapaleeshwarar Temple', 85, 13.0339, 80.269),
(255, 'Fort St. George is a historic colonial fort and one of the most important landmarks in Chennai.', '₹5', 'fort-st-george.jpg', 'Chennai, Tamil Nadu', 'Fort St. George', 85, 13.0795, 80.2875),
(256, 'The Shore Temple is an ancient stone temple overlooking the Bay of Bengal and a UNESCO World Heritage Site.', '₹40', 'shore-temple.jpg', 'Mahabalipuram, Tamil Nadu', 'Shore Temple', 86, 12.6169, 80.1993),
(257, 'Arjuna\'s Penance is a massive ancient rock relief featuring detailed sculptures from Hindu mythology.', 'Included with monument ticket', 'arjunas-penance.jpg', 'Mahabalipuram, Tamil Nadu', 'Arjuna\'s Penance', 86, 12.6177, 80.193),
(258, 'Pancha Rathas are a group of magnificent monolithic rock-cut temples representing ancient Dravidian architecture.', '₹40', 'pancha-rathas.jpg', 'Mahabalipuram, Tamil Nadu', 'Pancha Rathas', 86, 12.6069, 80.1907),
(259, 'Promenade Beach is a popular waterfront attraction known for its peaceful atmosphere and colonial surroundings.', 'Free', 'promenade-beach.jpg', 'Pondicherry', 'Promenade Beach', 87, 11.9335, 79.835),
(260, 'Auroville is an international township famous for its peaceful environment and the iconic Matrimandir.', 'Free', 'auroville.jpeg', 'Pondicherry', 'Auroville', 87, 12.0069, 79.81),
(261, 'Sri Aurobindo Ashram is a peaceful spiritual center associated with Sri Aurobindo and The Mother.', 'Free', 'auro-bindo-ashram.jpeg', 'Pondicherry', 'Sri Aurobindo Ashram', 87, 11.9338, 79.8292),
(262, 'Lalbagh is a historic botanical garden famous for its diverse plant collection and beautiful landscaped grounds.', '₹25', 'lalbagh.jpg', 'Bengaluru, Karnataka', 'Lalbagh Botanical Garden', 88, 12.95, 77.59),
(263, 'Bangalore Palace is a grand historic palace inspired by English architecture and known for its royal interiors.', '₹300', 'bangalore-palace.jpg', 'Bengaluru, Karnataka', 'Bangalore Palace', 88, 12.9507, 77.5848),
(264, 'Cubbon Park is a large green space in central Bengaluru known for walking paths, gardens and historic buildings.', 'Free', 'cubbon-park.jpg', 'Bengaluru, Karnataka', 'Cubbon Park', 88, 12.9763, 77.5929),
(265, 'Mysore Palace is one of India\'s most magnificent royal palaces and is especially famous for its illuminated facade.', '₹100', 'mysore-palace.jpg', 'Mysore, Karnataka', 'Mysore Palace', 89, 12.3052, 76.6552),
(266, 'Chamundi Hill is a popular religious and scenic attraction offering views over Mysore.', 'Free', 'chamundi-hill.jpg', 'Mysore, Karnataka', 'Chamundi Hill', 89, 12.272, 76.673),
(267, 'Brindavan Gardens is famous for its landscaped gardens, fountains and evening illumination.', '₹50', 'brindavan-gardens.jpg', 'Mysore, Karnataka', 'Brindavan Gardens', 89, 12.4244, 76.572),
(268, 'Virupaksha Temple is a magnificent historic temple and one of the most important monuments in Hampi.', 'Free', 'virupaksha-temple.jpg', 'Hampi, Karnataka', 'Virupaksha Temple', 90, 15.335, 76.46),
(269, 'Vijaya Vittala Temple is famous for its stone chariot, musical pillars and impressive Vijayanagara architecture.', '₹40', 'vittala-temple.jpg', 'Hampi, Karnataka', 'Vijaya Vittala Temple', 90, 15.314, 76.477),
(270, 'Hampi Bazaar is a historic market street lined with ancient structures and located near Virupaksha Temple.', 'Free', 'hampi-bazaar.jpg', 'Hampi, Karnataka', 'Hampi Bazaar', 90, 15.3352, 76.4597),
(271, 'Abbey Falls is a scenic waterfall surrounded by lush greenery and coffee plantations.', '₹20', 'abbey-falls.jpg', 'Coorg, Karnataka', 'Abbey Falls', 91, 12.458, 75.727),
(272, 'Raja\'s Seat is a scenic viewpoint famous for sunset views over the valleys and surrounding hills.', '₹20', 'rajas-seat.jpg', 'Madikeri, Coorg', 'Raja\'s Seat', 91, 12.426, 75.738),
(273, 'Dubare Elephant Camp is a popular wildlife attraction where visitors can learn about elephants and enjoy the surrounding forest.', 'Varies', 'dubare-elephant-camp.jpg', 'Coorg, Karnataka', 'Dubare Elephant Camp', 91, 12.455, 75.854),
(274, 'Charminar is Hyderabad\'s iconic monument and one of the city\'s most recognizable historic landmarks.', '₹25', 'charminar.jpg', 'Hyderabad, Telangana', 'Charminar', 92, 17.3616, 78.4747),
(275, 'Golconda Fort is a historic fortress famous for its massive walls, architecture, acoustics and fascinating history.', '₹25', 'golconda-fort.jpg', 'Hyderabad, Telangana', 'Golconda Fort', 92, 17.3833, 78.4011),
(276, 'Ramoji Film City is a massive film studio complex and entertainment destination offering tours and attractions.', '₹1,000+', 'ramoji-film-city.jpg', 'Hyderabad, Telangana', 'Ramoji Film City', 92, 17.2543, 78.6808),
(277, 'Ramakrishna Beach is a popular coastal attraction known for its long shoreline and beautiful sea views.', 'Free', 'rk-beach.jpg', 'Visakhapatnam, Andhra Pradesh', 'Ramakrishna Beach', 93, 17.714, 83.323),
(278, 'Kailasagiri is a hilltop park offering panoramic views of Visakhapatnam and the Bay of Bengal.', '₹20', 'kailasagiri.jpg', 'Visakhapatnam, Andhra Pradesh', 'Kailasagiri', 93, 17.747, 83.342),
(279, 'Borra Caves are spectacular limestone caves famous for their natural rock formations and underground chambers.', '₹60', 'borra-caves.jpg', 'Araku Valley, Andhra Pradesh', 'Borra Caves', 93, 18.282, 82.714),
(280, 'The Tirumala Venkateswara Temple is one of India\'s most visited pilgrimage sites dedicated to Lord Venkateswara.', 'Free', 'tirumala-temple.jpg', 'Tirupati, Andhra Pradesh', 'Tirumala Venkateswara Temple', 94, 13.6833, 79.347),
(281, 'Kapileswara Swamy Temple is a historic Shiva temple located near a scenic waterfall in Tirupati.', 'Free', 'kapileswara-temple.jpg', 'Tirupati, Andhra Pradesh', 'Sri Kapileswara Swamy Temple', 94, 13.638, 79.423),
(282, 'Talakona Waterfalls is a beautiful natural attraction surrounded by forests and hills.', '₹50', 'talakona-waterfalls.jpg', 'Tirupati District, Andhra Pradesh', 'Talakona Waterfalls', 94, 13.816, 79.115),
(283, 'The Golden Temple is one of India\'s most important spiritual landmarks and the central place of worship for Sikhs.', 'Free', 'golden-temple.jpg', 'Amritsar, Punjab', 'Golden Temple', 95, 31.62, 74.8765),
(284, 'Jallianwala Bagh is a historic memorial commemorating the victims of the 1919 massacre.', 'Free', 'jallianwala-bagh.jpg', 'Amritsar, Punjab', 'Jallianwala Bagh', 95, 31.63, 74.88),
(285, 'The Wagah Border is famous for its daily ceremonial border-closing ceremony between India and Pakistan.', 'Free', 'wagah-border.jpg', 'Attari, Punjab', 'Wagah Border', 95, 31.604, 74.574),
(286, 'Tsomgo Lake is a beautiful high-altitude glacial lake surrounded by snow-covered Himalayan mountains.', 'Permit required', 'tsomgo-lake.jpg', 'Gangtok, Sikkim', 'Tsomgo Lake', 96, 27.37, 88.759),
(287, 'Rumtek Monastery is one of Sikkim\'s most important Buddhist monasteries and is known for its beautiful architecture.', '₹10', 'rumtek-monastery.jpg', 'Gangtok, Sikkim', 'Rumtek Monastery', 96, 27.291, 88.56),
(288, 'MG Marg is Gangtok\'s popular pedestrian street filled with shops, restaurants and beautiful mountain-town scenery.', 'Free', 'mg-marg-gangtok.jpg', 'Gangtok, Sikkim', 'MG Marg', 96, 27.3314, 88.6139),
(289, 'Elephant Falls is one of Shillong\'s most popular waterfalls surrounded by lush greenery.', '₹20', 'elephant-falls.jpg', 'Shillong, Meghalaya', 'Elephant Falls', 97, 25.637, 91.878),
(290, 'Shillong Peak is the highest point in Shillong and offers panoramic views of the surrounding hills and city.', 'Free', 'shillong-peak.jpg', 'Shillong, Meghalaya', 'Shillong Peak', 97, 25.537, 91.874),
(291, 'Umiam Lake is a beautiful reservoir surrounded by green hills and is popular for boating and scenic views.', 'Free', 'umiam-lake.jpg', 'Near Shillong, Meghalaya', 'Umiam Lake', 97, 25.653, 91.88),
(292, 'Kaziranga National Park is famous for its population of one-horned rhinoceroses and diverse wildlife.', 'Safari charges apply', 'kaziranga-national-park.jpg', 'Assam', 'Kaziranga National Park', 98, 26.5775, 93.1711),
(293, 'Jeep safaris offer visitors an opportunity to explore Kaziranga\'s grasslands and observe wildlife in its natural habitat.', 'Safari charges apply', 'kaziranga-safari.jpg', 'Kaziranga, Assam', 'Kaziranga Jeep Safari', 98, 26.685, 93.175),
(294, 'Elephant safaris provide a unique way to explore parts of Kaziranga and observe wildlife from a different perspective.', 'Safari charges apply', 'kaziranga-elephant-safari.jpg', 'Kaziranga, Assam', 'Kaziranga Elephant Safari', 98, 26.6, 93.2),
(295, 'Radhanagar Beach is famous for its white sand, turquoise waters, sunsets and tropical surroundings.', 'Free', 'radhanagar-beach.jpg', 'Havelock Island, Andaman', 'Radhanagar Beach', 99, 11.987, 92.948),
(296, 'Cellular Jail is a historic colonial prison and important memorial associated with India\'s freedom struggle.', '₹30', 'cellular-jail.jpg', 'Port Blair, Andaman', 'Cellular Jail', 99, 11.6683, 92.747),
(297, 'Elephant Beach is famous for snorkeling, coral reefs, clear waters and various water sports.', 'Boat charges apply', 'elephant-beach.jpg', 'Havelock Island, Andaman', 'Elephant Beach', 99, 11.963, 92.98),
(298, 'Ranthambore National Park is one of India\'s most famous wildlife destinations and is particularly known for Bengal tigers.', 'Safari charges apply', 'ranthambore-national-park.jpg', 'Sawai Madhopur, Rajasthan', 'Ranthambore National Park', 100, 26.0273, 76.5226),
(299, 'Ranthambore Fort is a historic hilltop fort located inside the national park and surrounded by dramatic natural scenery.', '₹25', 'ranthambore-fort.jpg', 'Sawai Madhopur, Rajasthan', 'Ranthambore Fort', 100, 26.0173, 76.463),
(300, 'Padam Lake is a scenic water body inside Ranthambore National Park and an important wildlife viewing area.', 'Included with safari', 'padam-lake.jpeg', 'Ranthambore, Rajasthan', 'Padam Lake', 100, 26.021, 76.518),
(301, 'The White Rann is a vast salt desert famous for its stunning white landscape and spectacular sunsets.', 'Permit required', 'white-rann.jpg', 'Kutch, Gujarat', 'White Rann', 101, 23.849, 69.719),
(302, 'The Kutch Desert Festival celebrates Gujarati culture with music, dance, crafts, food and traditional performances.', 'Varies', 'kutch-desert-festival.jpg', 'Dhordo, Gujarat', 'Kutch Desert Festival', 101, 23.863, 69.655),
(303, 'Kalo Dungar, or Black Hill, is the highest point in Kutch and offers panoramic views of the surrounding Rann.', 'Free', 'kalo-dungar.jpg', 'Kutch, Gujarat', 'Kalo Dungar', 101, 23.843, 69.583),
(305, 'Prinsep Ghat in Kolkata is famous for its stunning white Palladian-style memorial, scenic river views of the Hooghly River and the Vidyasagar Setu bridge, and its role as a historic colonial jetty and popular modern recreational spot', 'Free', 'princep-ghat.jpg', 'West Bengal, Kolkata', 'Princep Ghat', 64, 22.55678, 88.3316);

-- --------------------------------------------------------

--
-- Table structure for table `destinations`
--

CREATE TABLE `destinations` (
  `id` bigint(20) NOT NULL,
  `best_time` varchar(255) DEFAULT NULL,
  `budget` varchar(255) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `destinations`
--

INSERT INTO `destinations` (`id`, `best_time`, `budget`, `description`, `image_url`, `name`, `state`) VALUES
(52, 'November - February', '₹15,000 - ₹30,000', 'Goa is famous for beautiful beaches, Portuguese architecture, nightlife and coastal culture.', 'goa.jpg', 'Goa', 'Goa'),
(53, 'October - March', '₹15,000 - ₹30,000', 'Jaipur is famous for magnificent forts, royal palaces, colorful markets and rich Rajasthani culture.', 'jaipur.jpg', 'Jaipur', 'Rajasthan'),
(54, 'October - March', '₹15,000 - ₹30,000', 'Udaipur is famous for beautiful lakes, royal palaces, historic architecture and scenic views of the Aravalli hills.', 'udaipur.jpg', 'Udaipur', 'Rajasthan'),
(55, 'October - March', '₹15,000 - ₹30,000', 'Jaisalmer is famous for its golden fort, desert landscapes, camel safaris and traditional Rajasthani architecture.', 'jaisalmer.jpg', 'Jaisalmer', 'Rajasthan'),
(56, 'October - March', '₹15,000 - ₹30,000', 'Jodhpur is famous for the magnificent Mehrangarh Fort, blue-painted houses, royal heritage and vibrant markets.', 'jodhpur.jpg', 'Jodhpur', 'Rajasthan'),
(57, 'October - March', '₹10,000 - ₹25,000', 'Agra is famous for the Taj Mahal, Agra Fort, Mughal architecture and its rich historical heritage.', 'agra.jpg', 'Agra', 'Uttar Pradesh'),
(58, 'October - March', '₹10,000 - ₹25,000', 'Varanasi is famous for its ancient temples, sacred ghats along the Ganges, spiritual traditions and vibrant culture.', 'varanasi.jpg', 'Varanasi', 'Uttar Pradesh'),
(59, 'October - March', '₹10,000 - ₹25,000', 'Ayodhya is a major pilgrimage destination known for its temples, religious heritage, sacred ghats and cultural significance.', 'ayodhya.jpg', 'Ayodhya', 'Uttar Pradesh'),
(60, 'October - March', '₹10,000 - ₹25,000', 'Delhi is famous for historic monuments, Mughal architecture, bustling markets, museums and diverse food culture.', 'delhi.jpg', 'Delhi', 'Delhi'),
(61, 'October - February', '₹15,000 - ₹30,000', 'Mumbai is famous for Bollywood, Marine Drive, historic landmarks, vibrant nightlife and its coastal lifestyle.', 'mumbai.jpg', 'Mumbai', 'Maharashtra'),
(62, 'October - February', '₹12,000 - ₹25,000', 'Pune is known for historic forts, Maratha heritage, cultural attractions, pleasant surroundings and a lively student culture.', 'pune.jpg', 'Pune', 'Maharashtra'),
(63, 'March - May', '₹10,000 - ₹25,000', 'Darjeeling is famous for tea gardens, spectacular Himalayan views, the Darjeeling Himalayan Railway and scenic mountain landscapes.', 'darjeeling.jpg', 'Darjeeling', 'West Bengal'),
(64, 'October - March', '₹10,000 - ₹25,000', 'Kolkata is famous for colonial architecture, cultural festivals, literature, art, historic landmarks and Bengali cuisine.', 'kolkata.jpg', 'Kolkata', 'West Bengal'),
(65, 'October - February', '₹10,000 - ₹25,000', 'Puri is famous for the Jagannath Temple, golden beaches, religious festivals and its rich coastal culture.', 'puri.jpg', 'Puri', 'Odisha'),
(66, 'October - March', '₹10,000 - ₹25,000', 'Bhubaneswar is famous for ancient temples, historic architecture, Kalinga heritage and nearby cultural attractions.', 'bhubaneswar.jpg', 'Bhubaneswar', 'Odisha'),
(67, 'October - March', '₹10,000 - ₹20,000', 'Konark is famous for the magnificent Sun Temple, intricate stone carvings and its remarkable ancient architecture.', 'konark.jpg', 'Konark', 'Odisha'),
(68, 'April - October', '₹20,000 - ₹40,000', 'Srinagar is famous for Dal Lake, traditional houseboats, Mughal gardens, beautiful valleys and Kashmiri culture.', 'srinagar.jpg', 'Srinagar', 'Jammu and Kashmir'),
(69, 'December - March', '₹20,000 - ₹40,000', 'Gulmarg is famous for snow-covered mountains, skiing, the Gulmarg Gondola and breathtaking Himalayan scenery.', 'gulmarg.jpg', 'Gulmarg', 'Jammu and Kashmir'),
(70, 'April - October', '₹20,000 - ₹40,000', 'Pahalgam is famous for green valleys, mountain landscapes, rivers, trekking routes and scenic natural beauty.', 'pahalgam.jpg', 'Pahalgam', 'Jammu and Kashmir'),
(71, 'May - September', '₹25,000 - ₹50,000', 'Leh is famous for dramatic Himalayan landscapes, Buddhist monasteries, high-altitude passes and adventurous road trips.', 'leh.jpg', 'Leh', 'Ladakh'),
(72, 'May - September', '₹25,000 - ₹50,000', 'Nubra Valley is famous for dramatic mountain landscapes, sand dunes, monasteries, double-humped camels and scenic villages.', 'nubra-valley.jpg', 'Nubra Valley', 'Ladakh'),
(73, 'May - September', '₹25,000 - ₹50,000', 'Pangong Lake is famous for its stunning blue waters, surrounding mountains and spectacular high-altitude landscape.', 'pangong-lake.jpg', 'Pangong Lake', 'Ladakh'),
(74, 'March - June', '₹15,000 - ₹30,000', 'Manali is famous for snow-covered mountains, scenic valleys, adventure activities and beautiful Himalayan landscapes.', 'manali.jpg', 'Manali', 'Himachal Pradesh'),
(75, 'March - June', '₹15,000 - ₹30,000', 'Shimla is famous for colonial architecture, mountain views, Mall Road, pleasant weather and scenic Himalayan surroundings.', 'shimla.jpg', 'Shimla', 'Himachal Pradesh'),
(76, 'March - June', '₹15,000 - ₹30,000', 'Dharamshala is famous for Himalayan scenery, Tibetan culture, monasteries, trekking trails and the nearby town of McLeod Ganj.', 'dharamshala.jpg', 'Dharamshala', 'Himachal Pradesh'),
(77, 'September - November', '₹10,000 - ₹25,000', 'Rishikesh is famous for yoga, spirituality, the Ganges, river rafting, adventure activities and Himalayan surroundings.', 'rishikesh.jpg', 'Rishikesh', 'Uttarakhand'),
(78, 'March - June', '₹12,000 - ₹25,000', 'Nainital is famous for its beautiful lake, surrounding hills, boating, viewpoints and pleasant mountain climate.', 'nainital.jpg', 'Nainital', 'Uttarakhand'),
(79, 'March - June', '₹12,000 - ₹25,000', 'Mussoorie is famous for scenic Himalayan views, waterfalls, Mall Road, pleasant weather and charming hill-station landscapes.', 'mussoorie.jpg', 'Mussoorie', 'Uttarakhand'),
(80, 'October - March', '₹10,000 - ₹20,000', 'Haridwar is famous for the sacred Ganges, Har Ki Pauri, spiritual ceremonies and important Hindu pilgrimage traditions.', 'haridwar.jpg', 'Haridwar', 'Uttarakhand'),
(81, 'October - February', '₹15,000 - ₹35,000', 'Kerala is famous for peaceful backwaters, lush greenery, beautiful beaches, hill stations and traditional culture.', 'kerala.jpg', 'Kerala', 'Kerala'),
(82, 'September - March', '₹15,000 - ₹30,000', 'Munnar is famous for vast tea plantations, misty mountains, waterfalls and beautiful green landscapes.', 'munnar.jpg', 'Munnar', 'Kerala'),
(83, 'October - February', '₹15,000 - ₹30,000', 'Alappuzha is famous for scenic backwaters, traditional houseboats, waterways and peaceful tropical landscapes.', 'alappuzha.jpg', 'Alappuzha', 'Kerala'),
(84, 'October - June', '₹12,000 - ₹25,000', 'Ooty is famous for tea gardens, beautiful hills, colonial charm, lakes and the scenic Nilgiri Mountain Railway.', 'ooty.jpg', 'Ooty', 'Tamil Nadu'),
(85, 'November - February', '₹10,000 - ₹25,000', 'Chennai is famous for Marina Beach, ancient temples, South Indian culture, classical arts and delicious cuisine.', 'chennai.jpg', 'Chennai', 'Tamil Nadu'),
(86, 'October - March', '₹10,000 - ₹20,000', 'Mahabalipuram is famous for ancient rock-cut temples, magnificent stone sculptures, Shore Temple and coastal scenery.', 'mahabalipuram.jpg', 'Mahabalipuram', 'Tamil Nadu'),
(87, 'October - March', '₹12,000 - ₹25,000', 'Pondicherry is famous for French colonial architecture, peaceful beaches, colorful streets, cafes and its unique coastal atmosphere.', 'pondicherry.jpg', 'Pondicherry', 'Puducherry'),
(88, 'October - February', '₹12,000 - ₹25,000', 'Bengaluru is famous for pleasant weather, gardens, modern technology, cafes and a vibrant urban culture.', 'bengaluru.jpg', 'Bengaluru', 'Karnataka'),
(89, 'October - February', '₹12,000 - ₹25,000', 'Mysore is famous for the magnificent Mysore Palace, royal heritage, traditional markets and the grand Dasara festival.', 'mysore.jpg', 'Mysore', 'Karnataka'),
(90, 'October - February', '₹12,000 - ₹25,000', 'Hampi is famous for ancient ruins, magnificent temples, historic monuments and the remains of the Vijayanagara Empire.', 'hampi.jpg', 'Hampi', 'Karnataka'),
(91, 'October - March', '₹12,000 - ₹25,000', 'Coorg is famous for coffee plantations, misty hills, waterfalls, forests and peaceful natural surroundings.', 'coorg.jpg', 'Coorg', 'Karnataka'),
(92, 'October - February', '₹10,000 - ₹25,000', 'Hyderabad is famous for Charminar, historic monuments, royal heritage, biryani and its unique blend of cultures.', 'hyderabad.jpg', 'Hyderabad', 'Telangana'),
(93, 'October - March', '₹10,000 - ₹25,000', 'Visakhapatnam is famous for beautiful beaches, coastal landscapes, hill viewpoints, caves and its scenic surroundings.', 'visakhapatnam.jpg', 'Visakhapatnam', 'Andhra Pradesh'),
(94, 'September - February', '₹10,000 - ₹25,000', 'Tirupati is one of India\'s most important pilgrimage destinations, famous for the sacred Venkateswara Temple.', 'tirupati.jpg', 'Tirupati', 'Andhra Pradesh'),
(95, 'October - March', '₹10,000 - ₹25,000', 'Amritsar is famous for the Golden Temple, Punjabi culture, historic sites, local cuisine and the Wagah Border ceremony.', 'amritsar.jpg', 'Amritsar', 'Punjab'),
(96, 'March - June', '₹15,000 - ₹30,000', 'Gangtok is famous for Himalayan views, Buddhist monasteries, scenic valleys, mountain roads and vibrant local culture.', 'gangtok.jpg', 'Gangtok', 'Sikkim'),
(97, 'October - April', '₹15,000 - ₹30,000', 'Shillong is famous for beautiful hills, waterfalls, lakes, pleasant weather and the unique culture of Meghalaya.', 'shillong.jpg', 'Shillong', 'Meghalaya'),
(98, 'November - April', '₹15,000 - ₹30,000', 'Kaziranga is famous for its wildlife sanctuary, one-horned rhinoceroses, elephants, tigers and rich biodiversity.', 'kaziranga.jpg', 'Kaziranga', 'Assam'),
(99, 'October - May', '₹25,000 - ₹50,000', 'The Andaman and Nicobar Islands are famous for crystal-clear waters, tropical beaches, coral reefs and water sports.', 'andaman.jpg', 'Andaman and Nicobar Islands', 'Andaman and Nicobar Islands'),
(100, 'October - April', '₹15,000 - ₹35,000', 'Ranthambore is famous for wildlife safaris, Bengal tigers, ancient ruins and the historic Ranthambore Fort.', 'ranthambore.jpg', 'Ranthambore', 'Rajasthan'),
(101, 'November - February', '₹15,000 - ₹30,000', 'The Rann of Kutch is famous for its vast white salt desert, cultural festivals, handicrafts and traditional Gujarati culture.', 'rann-of-kutch.jpg', 'Rann of Kutch', 'Gujarat');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint(20) NOT NULL,
  `destination_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `destination_id`, `user_id`) VALUES
(7, 64, 3);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) NOT NULL,
  `comment` varchar(1000) NOT NULL,
  `rating` int(11) NOT NULL,
  `destination_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `comment`, `rating`, `destination_id`, `user_id`) VALUES
(2, 'wao nice', 5, 59, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `password`, `role`) VALUES
(3, '007rajhalder@gmail.com', 'Subhajit Raj Halder', '$2a$10$0.UnRjdRRkSHWHC0LLyHB.yqZFbIqzf079RqMR6KBSNYGj2XqbgMS', 'ADMIN'),
(4, '007subhajitrajhalder@gmail.com', 'raj halder', '$2a$10$FI9Z.XsnwtJJ3rv31T5dOuenHo7wuyCYZ8dtjjwM7CWS/L77PjXWO', 'USER'),
(7, 'g@g.com', 'gg', '$2a$10$YTZzzOBZxQcoIf/zH9JPmu/h74APjEvkR2vi28LOYtR0aMTJztQ6m', 'USER');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attractions`
--
ALTER TABLE `attractions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8ftru0x7ao5mding49cf84w9o` (`destination_id`);

--
-- Indexes for table `destinations`
--
ALTER TABLE `destinations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK2rfay1nr1sdeunhg08ssw0cl7` (`user_id`,`destination_id`),
  ADD KEY `FKc9hci4f44c3i90h4fbsesr26d` (`destination_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKi7mal1bcvgkmhfigmfggdgyn4` (`user_id`,`destination_id`),
  ADD KEY `FKo07xgps8spbcjhqpj559t835x` (`destination_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attractions`
--
ALTER TABLE `attractions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=306;

--
-- AUTO_INCREMENT for table `destinations`
--
ALTER TABLE `destinations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attractions`
--
ALTER TABLE `attractions`
  ADD CONSTRAINT `FK8ftru0x7ao5mding49cf84w9o` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`);

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `FKc9hci4f44c3i90h4fbsesr26d` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`),
  ADD CONSTRAINT `FKk7du8b8ewipawnnpg76d55fus` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKo07xgps8spbcjhqpj559t835x` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`);
COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
