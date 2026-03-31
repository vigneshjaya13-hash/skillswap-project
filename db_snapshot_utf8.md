## MySQL Database Snapshot

### Table: `users`
| id | username | email | password_hash | created_at |
| --- | --- | --- | --- | --- |
| 1 | jayavignesh | vigneshjaya13@gmail.com | Vignesh0907 | 2026-03-23T12:20:09.000Z |
| 2 | SystemAdmin | systemadmin@example.com | password123 | 2026-03-23T12:43:45.000Z |
| 3 | ProCoder | procoder@example.com | password123 | 2026-03-23T12:43:45.000Z |
| 4 | DesignGuru | designguru@example.com | password123 | 2026-03-23T12:43:45.000Z |
| 5 | LanguageExpert | languageexpert@example.com | password123 | 2026-03-23T12:43:45.000Z |
| 6 | DataNerd | datanerd@example.com | password123 | 2026-03-23T12:43:45.000Z |
| 7 | Demoman | demo1@test.com | password123 | 2026-03-23T13:12:55.000Z |

### Table: `skills`
| id | user_id | name | description | category | type | created_at | resource_link |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 3 | Full-Stack Next.js Mastery | Learn React, Next.js, and API routes. I uploaded a complete guide repository! | Development | offered | 2026-03-23T12:43:45.000Z | https://nextjs.org/learn |
| 2 | 4 | Figma to Code | Detailed guide on turning Figma designs into CSS and Tailwind. | Design | offered | 2026-03-23T12:43:45.000Z | https://figma.com/resources |
| 3 | 5 | Spanish A1 to B2 | A massive collection of Spanish grammar worksheets. Available instantly here: | Languages | offered | 2026-03-23T12:43:45.000Z | https://studyspanish.com |
| 4 | 6 | Intro to Machine Learning | Jupyter notebooks and datasets for ML beginners. | Data Science | offered | 2026-03-23T12:43:45.000Z | https://kaggle.com/learn |
| 5 | 2 | Advanced Docker & Kubernetes | Containerize any web application securely with my official Docker compose templates. | Development | offered | 2026-03-23T12:43:45.000Z | https://docker.com/101 |
| 6 | 3 | Mastering Git & GitHub | The absolute best cheat sheet for branching, merging, and resolving conflicts. | Development | offered | 2026-03-23T12:43:45.000Z | https://docs.github.com/en |
| 7 | 4 | Typography 101 | Understanding kerning, leading, and font pairing for premium websites. | Design | offered | 2026-03-23T12:43:45.000Z | https://fonts.google.com/knowledge |
| 8 | 6 | SQL Query Optimization | How to use indexing and EXPLAIN plans to speed up your database queries 100x. | Data Science | offered | 2026-03-23T12:43:45.000Z | https://dev.mysql.com/doc/refman/8.0/en/optimization.html |
| 9 | 3 | Advanced Rust / Solidity | I want to learn how to build Web3 smart contracts. Here is the syllabus I am trying to follow: | Development | requested | 2026-03-23T12:43:45.000Z | https://docs.soliditylang.org/ |
| 10 | 5 | Japanese Pronunciation | Need a native speaker to help me practice my pitch accent. | Languages | requested | 2026-03-23T12:43:45.000Z | NULL |
| 11 | 2 | Cybersecurity Basics | Looking for a baseline introduction to network sec and Wireshark. | Other | requested | 2026-03-23T12:43:45.000Z | NULL |
| 12 | 4 | Adobe After Effects | Need someone to show me how to use mask tracking correctly. | Design | requested | 2026-03-23T12:43:45.000Z | NULL |
| 13 | 6 | Python Automation Scripts | I uploaded my 5 best scripts for automating Excel and Email tasks. | Data Science | offered | 2026-03-23T12:43:45.000Z | https://automatetheboringstuff.com/ |
| 14 | 5 | Public Speaking Confidence | A workbook and video series overcoming stage fright. | Soft Skills | offered | 2026-03-23T12:43:45.000Z | https://www.toastmasters.org/resources |
| 15 | 3 | Node.js Express Security | Learn how to prevent SQL injection and set up CORS correctly. | Development | offered | 2026-03-23T12:43:45.000Z | https://expressjs.com/en/advanced/best-practice-security.html |
| 16 | 2 | Linux Server Administration | My personal bash script collection and administration handbook. | Development | offered | 2026-03-23T12:43:45.000Z | https://ubuntu.com/tutorials |
| 17 | 4 | Color Theory in Practice | Upload of the color palette workbook I created for new designers. | Design | offered | 2026-03-23T12:43:45.000Z | https://color.adobe.com/create/color-wheel |
| 18 | 6 | Data Visualization with Tableau | A comprehensive starter dashboard you can download right now to practice. | Data Science | offered | 2026-03-23T12:43:45.000Z | https://public.tableau.com/en-us/s/resources |

### Table: `swaps`
| id | requester_id | provider_id | skill_id | status | created_at |
| --- | --- | --- | --- | --- | --- |
| 26 | 1 | 3 | 1 | pending | 2026-03-23T12:52:52.000Z |
| 27 | 1 | 3 | 1 | pending | 2026-03-23T12:52:53.000Z |
| 28 | 1 | 3 | 1 | pending | 2026-03-23T12:52:53.000Z |
| 29 | 1 | 3 | 1 | pending | 2026-03-23T12:52:54.000Z |
| 30 | 1 | 4 | 2 | pending | 2026-03-23T12:52:55.000Z |
| 31 | 1 | 3 | 9 | pending | 2026-03-23T12:53:41.000Z |
| 32 | 1 | 6 | 8 | pending | 2026-03-23T12:53:43.000Z |
| 33 | 1 | 6 | 8 | pending | 2026-03-23T12:53:43.000Z |
| 34 | 1 | 6 | 8 | pending | 2026-03-23T12:53:43.000Z |
| 35 | 1 | 6 | 4 | pending | 2026-03-23T13:05:03.000Z |
| 36 | 1 | 6 | 4 | pending | 2026-03-23T13:05:05.000Z |
| 37 | 1 | 6 | 4 | pending | 2026-03-23T13:05:05.000Z |
| 38 | 1 | 6 | 4 | pending | 2026-03-23T13:05:05.000Z |
| 39 | 1 | 3 | 6 | pending | 2026-03-23T13:05:20.000Z |
| 40 | 1 | 3 | 6 | pending | 2026-03-23T13:05:20.000Z |
| 41 | 1 | 3 | 6 | pending | 2026-03-23T13:05:21.000Z |
| 42 | 1 | 3 | 6 | pending | 2026-03-23T13:05:21.000Z |
| 43 | 1 | 3 | 6 | pending | 2026-03-23T13:05:21.000Z |
| 44 | 1 | 3 | 6 | pending | 2026-03-23T13:05:23.000Z |
| 45 | 1 | 3 | 6 | pending | 2026-03-23T13:05:23.000Z |
| 46 | 1 | 3 | 6 | pending | 2026-03-23T13:05:24.000Z |
| 47 | 7 | 3 | 1 | pending | 2026-03-23T13:13:24.000Z |
| 48 | 7 | 3 | 1 | pending | 2026-03-23T13:13:43.000Z |
| 49 | 7 | 3 | 1 | pending | 2026-03-23T13:15:53.000Z |
| 50 | 7 | 3 | 1 | pending | 2026-03-23T13:21:38.000Z |
| 51 | 7 | 5 | 10 | pending | 2026-03-23T13:21:50.000Z |
| 52 | 7 | 3 | 1 | pending | 2026-03-23T13:49:17.000Z |
| 53 | 7 | 4 | 2 | pending | 2026-03-23T15:53:39.000Z |

