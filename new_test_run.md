input : 

{
  "enrichWebsite": true,
  "location": "Paris, 75116,  France",
  "maxEnrich": 5,
  "maxResults": 5,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": [
      "RESIDENTIAL"
    ]
  },
  "searchTerms": [
    "Grill"
  ]
}

output : 

[
  {
    "title": "Grill Bar",
    "address": "74 Rue Saint-Didier, 75116 Paris, France",
    "phone": "+33 1 45 05 17 17",
    "website": "http://www.grillbar.fr/",
    "mapsUrl": "https://www.google.com/maps/place/Grill+Bar/data=!4m7!3m6!1s0x47e66f5186005c87:0x1a3446e7ba70ee10!8m2!3d48.8677807!4d2.2817583!16s%2Fg%2F11f78b4fjq!19sChIJh1wAhlFv5kcREO5wuudGNBo?authuser=0&hl=en&rclk=1",
    "scrapedAt": "2026-02-07T22:53:49.996Z",
    "techStack": [
      "WordPress"
    ],
    "enrichmentStatus": "success"
  },
  {
    "title": "Frog XVI",
    "address": "110 bis Av. Kléber, 75016 Paris, France",
    "phone": "+33 1 47 27 88 88",
    "website": "http://www.frogpubs.com/pub-frog-xvi-paris-5.php",
    "mapsUrl": "https://www.google.com/maps/place/Frog+XVI/data=!4m7!3m6!1s0x47e66ffad6467d9f:0x1b4e7ec3706a5e88!8m2!3d48.8646712!4d2.2881255!16s%2Fg%2F1vfp7j0m!19sChIJn31G1vpv5kcRiF5qcMN-Ths?authuser=0&hl=en&rclk=1",
    "scrapedAt": "2026-02-07T22:54:19.890Z",
    "techStack": [
      "WordPress",
      "Google Analytics",
      "PHP"
    ],
    "enrichmentStatus": "success"
  },
  {
    "title": "Romeo - Bar & Grill",
    "address": "6 Pl. Victor Hugo, 75016 Paris, France",
    "phone": "+33 1 45 01 22 22",
    "website": "http://www.restaurantromeo.fr/",
    "mapsUrl": "https://www.google.com/maps/place/Romeo+-+Bar+%26+Grill/data=!4m7!3m6!1s0x47e66ff0dfc4e92d:0xe9f67f1621b4737f!8m2!3d48.8701037!4d2.2850209!16s%2Fg%2F11b6cxt9mv!19sChIJLenE3_Bv5kcRf3O0IRZ_9uk?authuser=0&hl=en&rclk=1",
    "scrapedAt": "2026-02-07T22:54:48.089Z",
    "techStack": [
      "Nginx"
    ],
    "enrichmentStatus": "success"
  },
  {
    "title": "Karamna",
    "address": "77 Rue Boissière, 75116 Paris, France",
    "phone": "+33 1 45 00 71 34",
    "website": "https://www.karamna.fr/",
    "mapsUrl": "https://www.google.com/maps/place/Karamna/data=!4m7!3m6!1s0x47e66fecea65b93b:0x962b168f8ebb1729!8m2!3d48.8689166!4d2.2862857!16s%2Fg%2F11fk79y412!19sChIJO7ll6uxv5kcRKRe7jo8WK5Y?authuser=0&hl=en&rclk=1",
    "scrapedAt": "2026-02-07T22:55:14.288Z",
    "techStack": [],
    "enrichmentStatus": "success"
  },
  {
    "title": "Rôtisserie du 16ème",
    "address": "16 Rue Dufrenoy, 75116 Paris, France",
    "phone": "+33 1 45 04 59 76",
    "website": "https://www.rotisseriedu16.fr/",
    "mapsUrl": "https://www.google.com/maps/place/R%C3%B4tisserie+du+16%C3%A8me/data=!4m7!3m6!1s0x47e665a554bf23e9:0x5476eec3336a73a!8m2!3d48.8662651!4d2.27378!16s%2Fg%2F11fpsm0gw1!19sChIJ6SO_VKVl5kcROqc2M-xuRwU?authuser=0&hl=en&rclk=1",
    "scrapedAt": "2026-02-07T22:55:33.688Z",
    "techStack": [
      "Wix"
    ],
    "enrichmentStatus": "success"
  }
]

logs : 

2026-02-07T22:49:38.611Z ACTOR: Pulling container image of build q439csDk7a0cwwb44 from registry.
2026-02-07T22:49:40.285Z ACTOR: Creating container.
2026-02-07T22:49:40.380Z ACTOR: Starting container.
2026-02-07T22:49:40.382Z ACTOR: Running under "LIMITED_PERMISSIONS" permission level.
2026-02-07T22:49:40.668Z Will run command: xvfb-run -a -s "-ac -screen 0 1920x1080x24+32 -nolisten tcp" npm start
2026-02-07T22:49:41.321Z
2026-02-07T22:49:41.375Z > smart-maps-scraper@1.0.0 start
2026-02-07T22:49:41.376Z > node src/main.js
2026-02-07T22:49:41.378Z
2026-02-07T22:49:44.448Z INFO  System info {"apifyVersion":"3.5.3","apifyClientVersion":"2.22.0","crawleeVersion":"3.15.3","osType":"Linux","nodeVersion":"v20.20.0"}
2026-02-07T22:49:45.931Z INFO  PlaywrightCrawler: Starting the crawler.
2026-02-07T22:50:02.992Z INFO  PlaywrightCrawler: Processing https://www.google.com/maps?hl=en [START]
2026-02-07T22:50:06.689Z INFO  PlaywrightCrawler: Searching for: Grill in Paris, 75116,  France
2026-02-07T22:50:08.090Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:50:16.691Z INFO  PlaywrightCrawler: Standard search box missing. Checking for input[name="q"]...
2026-02-07T22:50:18.285Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:50:28.385Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:50:35.988Z INFO  PlaywrightCrawler: Feed found via: div[aria-label*="Results"]
2026-02-07T22:50:35.990Z INFO  PlaywrightCrawler: Scrolling for results...
2026-02-07T22:50:38.487Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:50:46.008Z INFO  PlaywrightCrawler:Statistics: PlaywrightCrawler request statistics: {"requestAvgFailedDurationMillis":null,"requestAvgFinishedDurationMillis":null,"requestsFinishedPerMinute":0,"requestsFailedPerMinute":0,"requestTotalDurationMillis":0,"requestsTotal":0,"crawlerRuntimeMillis":60494,"retryHistogram":[]}
2026-02-07T22:50:46.088Z INFO  PlaywrightCrawler:AutoscaledPool: state {"currentConcurrency":1,"desiredConcurrency":1,"systemStatus":{"isSystemIdle":false,"memInfo":{"isOverloaded":true,"limitRatio":0.2,"actualRatio":1},"eventLoopInfo":{"isOverloaded":false,"limitRatio":0.6,"actualRatio":0.299},"cpuInfo":{"isOverloaded":true,"limitRatio":0.4,"actualRatio":0.855},"clientInfo":{"isOverloaded":false,"limitRatio":0.3,"actualRatio":0}}}
2026-02-07T22:50:48.589Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:50:59.296Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:50:59.588Z INFO  PlaywrightCrawler: Found 19 potential listings.
2026-02-07T22:51:03.092Z WARN  PlaywrightCrawler: Reclaiming failed request back to the list or queue. requestHandler timed out after 60 seconds. {"id":"eFrg0ehrBrKRlPx","url":"https://www.google.com/maps?hl=en","retryCount":1}
2026-02-07T22:51:16.201Z INFO  PlaywrightCrawler: Processing https://www.google.com/maps?hl=en [START]
2026-02-07T22:51:19.891Z INFO  PlaywrightCrawler: Searching for: Grill in Paris, 75116,  France
2026-02-07T22:51:29.892Z INFO  PlaywrightCrawler: Standard search box missing. Checking for input[name="q"]...
2026-02-07T22:51:31.385Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:51:42.112Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:51:45.988Z INFO  PlaywrightCrawler:Statistics: PlaywrightCrawler request statistics: {"requestAvgFailedDurationMillis":null,"requestAvgFinishedDurationMillis":null,"requestsFinishedPerMinute":0,"requestsFailedPerMinute":0,"requestTotalDurationMillis":0,"requestsTotal":0,"crawlerRuntimeMillis":120494,"retryHistogram":[]}
2026-02-07T22:51:46.288Z INFO  PlaywrightCrawler:AutoscaledPool: state {"currentConcurrency":1,"desiredConcurrency":1,"systemStatus":{"isSystemIdle":false,"memInfo":{"isOverloaded":true,"limitRatio":0.2,"actualRatio":0.75},"eventLoopInfo":{"isOverloaded":false,"limitRatio":0.6,"actualRatio":0.123},"cpuInfo":{"isOverloaded":true,"limitRatio":0.4,"actualRatio":1},"clientInfo":{"isOverloaded":false,"limitRatio":0.3,"actualRatio":0}}}
2026-02-07T22:51:52.974Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:52:04.007Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 975 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:52:06.287Z INFO  PlaywrightCrawler: Feed found via: div.m6QErb[aria-label]
2026-02-07T22:52:06.289Z INFO  PlaywrightCrawler: Scrolling for results...
2026-02-07T22:52:15.495Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:52:16.190Z WARN  PlaywrightCrawler: Reclaiming failed request back to the list or queue. requestHandler timed out after 60 seconds. {"id":"eFrg0ehrBrKRlPx","url":"https://www.google.com/maps?hl=en","retryCount":2}
2026-02-07T22:52:28.293Z INFO  PlaywrightCrawler: Processing https://www.google.com/maps?hl=en [START]
2026-02-07T22:52:30.989Z INFO  PlaywrightCrawler: Searching for: Grill in Paris, 75116,  France
2026-02-07T22:52:40.990Z INFO  PlaywrightCrawler: Standard search box missing. Checking for input[name="q"]...
2026-02-07T22:52:45.988Z INFO  PlaywrightCrawler:Statistics: PlaywrightCrawler request statistics: {"requestAvgFailedDurationMillis":null,"requestAvgFinishedDurationMillis":null,"requestsFinishedPerMinute":0,"requestsFailedPerMinute":0,"requestTotalDurationMillis":0,"requestsTotal":0,"crawlerRuntimeMillis":180494,"retryHistogram":[]}
2026-02-07T22:52:46.397Z INFO  PlaywrightCrawler:AutoscaledPool: state {"currentConcurrency":1,"desiredConcurrency":1,"systemStatus":{"isSystemIdle":false,"memInfo":{"isOverloaded":false,"limitRatio":0.2,"actualRatio":0.195},"eventLoopInfo":{"isOverloaded":false,"limitRatio":0.6,"actualRatio":0.079},"cpuInfo":{"isOverloaded":true,"limitRatio":0.4,"actualRatio":0.929},"clientInfo":{"isOverloaded":false,"limitRatio":0.3,"actualRatio":0}}}
2026-02-07T22:52:56.386Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:52:57.999Z INFO  PlaywrightCrawler: Feed found via: div[aria-label*="Results"]
2026-02-07T22:52:58.001Z INFO  PlaywrightCrawler: Scrolling for results...
2026-02-07T22:53:06.770Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 974 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:53:17.548Z WARN  PlaywrightCrawler:AutoscaledPool:Snapshotter: Memory is critically overloaded. Using 976 MB of 1024 MB (95%). Consider increasing available memory.
2026-02-07T22:53:21.093Z INFO  PlaywrightCrawler: Found 17 potential listings.
2026-02-07T22:53:22.499Z INFO  PlaywrightCrawler: Enqueuing 5 unique places.
2026-02-07T22:53:44.390Z INFO  PlaywrightCrawler: Processing https://www.google.com/maps/place/Grill+Bar/data=!4m7!3m6!1s0x47e66f5186005c87:0x1a3446e7ba70ee10!8m2!3d48.8677807!4d2.2817583!16s%2Fg%2F11f78b4fjq!19sChIJh1wAhlFv5kcREO5wuudGNBo?authuser=0&hl=en&rclk=1 [DETAIL]
2026-02-07T22:53:45.988Z INFO  PlaywrightCrawler:Statistics: PlaywrightCrawler request statistics: {"requestAvgFailedDurationMillis":null,"requestAvgFinishedDurationMillis":64685,"requestsFinishedPerMinute":0,"requestsFailedPerMinute":0,"requestTotalDurationMillis":64685,"requestsTotal":1,"crawlerRuntimeMillis":240494,"retryHistogram":[null,null,1]}
2026-02-07T22:53:46.595Z INFO  PlaywrightCrawler:AutoscaledPool: state {"currentConcurrency":1,"desiredConcurrency":1,"systemStatus":{"isSystemIdle":false,"memInfo":{"isOverloaded":true,"limitRatio":0.2,"actualRatio":0.224},"eventLoopInfo":{"isOverloaded":false,"limitRatio":0.6,"actualRatio":0.166},"cpuInfo":{"isOverloaded":true,"limitRatio":0.4,"actualRatio":0.924},"clientInfo":{"isOverloaded":false,"limitRatio":0.3,"actualRatio":0}}}
2026-02-07T22:53:48.086Z INFO  PlaywrightCrawler: Scraping details: https://www.google.com/maps/place/Grill+Bar/data=!4m7!3m6!1s0x47e66f5186005c87:0x1a3446e7ba70ee10!8m2!3d48.8677807!4d2.2817583!16s%2Fg%2F11f78b4fjq!19sChIJh1wAhlFv5kcREO5wuudGNBo?authuser=0&hl=en&rclk=1
2026-02-07T22:53:49.996Z INFO  PlaywrightCrawler: Enriching http://www.grillbar.fr/ (HTTP)...
2026-02-07T22:53:52.989Z INFO  PlaywrightCrawler: [HTTP] Enriched Grill Bar: WordPress
2026-02-07T22:54:14.790Z INFO  PlaywrightCrawler: Processing https://www.google.com/maps/place/Frog+XVI/data=!4m7!3m6!1s0x47e66ffad6467d9f:0x1b4e7ec3706a5e88!8m2!3d48.8646712!4d2.2881255!16s%2Fg%2F1vfp7j0m!19sChIJn31G1vpv5kcRiF5qcMN-Ths?authuser=0&hl=en&rclk=1 [DETAIL]
2026-02-07T22:54:17.096Z INFO  PlaywrightCrawler: Scraping details: https://www.google.com/maps/place/Frog+XVI/data=!4m7!3m6!1s0x47e66ffad6467d9f:0x1b4e7ec3706a5e88!8m2!3d48.8646712!4d2.2881255!16s%2Fg%2F1vfp7j0m!19sChIJn31G1vpv5kcRiF5qcMN-Ths?authuser=0&hl=en&rclk=1
2026-02-07T22:54:19.893Z INFO  PlaywrightCrawler: Enriching http://www.frogpubs.com/pub-frog-xvi-paris-5.php (HTTP)...
2026-02-07T22:54:22.586Z INFO  PlaywrightCrawler: [HTTP] Enriched Frog XVI: WordPress, Google Analytics, PHP
2026-02-07T22:54:40.891Z INFO  PlaywrightCrawler: Processing https://www.google.com/maps/place/Romeo+-+Bar+%26+Grill/data=!4m7!3m6!1s0x47e66ff0dfc4e92d:0xe9f67f1621b4737f!8m2!3d48.8701037!4d2.2850209!16s%2Fg%2F11b6cxt9mv!19sChIJLenE3_Bv5kcRf3O0IRZ_9uk?authuser=0&hl=en&rclk=1 [DETAIL]
2026-02-07T22:54:45.792Z INFO  PlaywrightCrawler: Scraping details: https://www.google.com/maps/place/Romeo+-+Bar+%26+Grill/data=!4m7!3m6!1s0x47e66ff0dfc4e92d:0xe9f67f1621b4737f!8m2!3d48.8701037!4d2.2850209!16s%2Fg%2F11b6cxt9mv!19sChIJLenE3_Bv5kcRf3O0IRZ_9uk?authuser=0&hl=en&rclk=1
2026-02-07T22:54:45.988Z INFO  PlaywrightCrawler:Statistics: PlaywrightCrawler request statistics: {"requestAvgFailedDurationMillis":null,"requestAvgFinishedDurationMillis":41303,"requestsFinishedPerMinute":1,"requestsFailedPerMinute":0,"requestTotalDurationMillis":123910,"requestsTotal":3,"crawlerRuntimeMillis":300494,"retryHistogram":[2,null,1]}
2026-02-07T22:54:46.900Z INFO  PlaywrightCrawler:AutoscaledPool: state {"currentConcurrency":1,"desiredConcurrency":1,"systemStatus":{"isSystemIdle":false,"memInfo":{"isOverloaded":false,"limitRatio":0.2,"actualRatio":0},"eventLoopInfo":{"isOverloaded":false,"limitRatio":0.6,"actualRatio":0.246},"cpuInfo":{"isOverloaded":true,"limitRatio":0.4,"actualRatio":0.865},"clientInfo":{"isOverloaded":false,"limitRatio":0.3,"actualRatio":0}}}
2026-02-07T22:54:48.109Z INFO  PlaywrightCrawler: Enriching http://www.restaurantromeo.fr/ (HTTP)...
2026-02-07T22:54:50.089Z INFO  PlaywrightCrawler: [HTTP] Enriched Romeo - Bar & Grill: Nginx
2026-02-07T22:55:08.386Z INFO  PlaywrightCrawler: Processing https://www.google.com/maps/place/Karamna/data=!4m7!3m6!1s0x47e66fecea65b93b:0x962b168f8ebb1729!8m2!3d48.8689166!4d2.2862857!16s%2Fg%2F11fk79y412!19sChIJO7ll6uxv5kcRKRe7jo8WK5Y?authuser=0&hl=en&rclk=1 [DETAIL]
2026-02-07T22:55:10.887Z INFO  PlaywrightCrawler: Scraping details: https://www.google.com/maps/place/Karamna/data=!4m7!3m6!1s0x47e66fecea65b93b:0x962b168f8ebb1729!8m2!3d48.8689166!4d2.2862857!16s%2Fg%2F11fk79y412!19sChIJO7ll6uxv5kcRKRe7jo8WK5Y?authuser=0&hl=en&rclk=1
2026-02-07T22:55:14.290Z INFO  PlaywrightCrawler: Enriching https://www.karamna.fr/ (HTTP)...
2026-02-07T22:55:16.085Z INFO  PlaywrightCrawler: [HTTP] Enriched Karamna:
2026-02-07T22:55:28.288Z INFO  PlaywrightCrawler: Processing https://www.google.com/maps/place/R%C3%B4tisserie+du+16%C3%A8me/data=!4m7!3m6!1s0x47e665a554bf23e9:0x5476eec3336a73a!8m2!3d48.8662651!4d2.27378!16s%2Fg%2F11fpsm0gw1!19sChIJ6SO_VKVl5kcROqc2M-xuRwU?authuser=0&hl=en&rclk=1 [DETAIL]
2026-02-07T22:55:31.885Z INFO  PlaywrightCrawler: Scraping details: https://www.google.com/maps/place/R%C3%B4tisserie+du+16%C3%A8me/data=!4m7!3m6!1s0x47e665a554bf23e9:0x5476eec3336a73a!8m2!3d48.8662651!4d2.27378!16s%2Fg%2F11fpsm0gw1!19sChIJ6SO_VKVl5kcROqc2M-xuRwU?authuser=0&hl=en&rclk=1
2026-02-07T22:55:33.688Z INFO  PlaywrightCrawler: Enriching https://www.rotisseriedu16.fr/ (HTTP)...
2026-02-07T22:55:37.991Z INFO  PlaywrightCrawler: [HTTP] Enriched Rôtisserie du 16ème: Wix
2026-02-07T22:55:38.815Z INFO  PlaywrightCrawler: All requests from the queue have been processed, the crawler will shut down.
2026-02-07T22:55:40.940Z INFO  PlaywrightCrawler: Final request statistics: {"requestsFinished":6,"requestsFailed":0,"retryHistogram":[5,null,1],"requestAvgFailedDurationMillis":null,"requestAvgFinishedDurationMillis":32757,"requestsFinishedPerMinute":1,"requestsFailedPerMinute":0,"requestTotalDurationMillis":196541,"requestsTotal":6,"crawlerRuntimeMillis":355446}
2026-02-07T22:55:40.942Z INFO  PlaywrightCrawler: Finished! Total 6 requests: 6 succeeded, 0 failed. {"terminal":true}
