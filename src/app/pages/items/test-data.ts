import { MovableItemWithDetails } from './items-data.service';

export const testItems: MovableItemWithDetails[] = [
  {
    "id": 1,
    "name": "Pressure Culf 12",
    "description": "",
    "category": {
      "id": 2,
      "singularName": "Oxygen Tank",
      "pluralName": "Oxygen Tanks",
      "svgIcon": "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"48\" height=\"48\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 48 48\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M17 6h2V4h-6v2h2v2h-2.17a3.001 3.001 0 100 2H15v2.083A6.002 6.002 0 0010 18v25a1 1 0 001 1h10a1 1 0 001-1V18a6.002 6.002 0 00-5-5.917V10h5V8h-5V6Zm-1 8a4 4 0 00-4 4v2h8v-2a4 4 0 00-4-4Zm-4 28V22h8v20h-8ZM9 9a1 1 0 112 0 1 1 0 01-2 0Zm17 12a4 4 0 018 0v6a4 4 0 01-8 0v-6Zm4-2a2 2 0 00-2 2v6a2 2 0 104 0v-6a2 2 0 00-2-2Zm8 7h-3v-2h3a3 3 0 110 6 1 1 0 00-1 1v1h4v2h-5a1 1 0 01-1-1v-2a3 3 0 013-3 1 1 0 100-2Z\" clip-rule=\"evenodd\"/></svg>"
    },
    "visibility": true,
    "createdAt": new Date("2024-05-08T19:42:59.881851Z"),
    "instancesCount": 2,
    "bookedBy": [],
    "takenBy": []
  },
  {
    "id": 2,
    "name": "Oxygen Tank",
    "description": "",
    "category": {
      "id": 2,
      "singularName": "Oxygen Tank",
      "pluralName": "Oxygen Tanks",
      "svgIcon": "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"48\" height=\"48\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 48 48\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M17 6h2V4h-6v2h2v2h-2.17a3.001 3.001 0 100 2H15v2.083A6.002 6.002 0 0010 18v25a1 1 0 001 1h10a1 1 0 001-1V18a6.002 6.002 0 00-5-5.917V10h5V8h-5V6Zm-1 8a4 4 0 00-4 4v2h8v-2a4 4 0 00-4-4Zm-4 28V22h8v20h-8ZM9 9a1 1 0 112 0 1 1 0 01-2 0Zm17 12a4 4 0 018 0v6a4 4 0 01-8 0v-6Zm4-2a2 2 0 00-2 2v6a2 2 0 104 0v-6a2 2 0 00-2-2Zm8 7h-3v-2h3a3 3 0 110 6 1 1 0 00-1 1v1h4v2h-5a1 1 0 01-1-1v-2a3 3 0 013-3 1 1 0 100-2Z\" clip-rule=\"evenodd\"/></svg>"
    },
    "visibility": true,
    "createdAt": new Date("2024-05-08T19:42:59.881851Z"),
    "instancesCount": 0,
    "bookedBy": [],
    "takenBy": []
  },
  {
    "id": 3,
    "name": "Wheelchair",
    "description": "",
    "category": {
      "id": 3,
      "singularName": "Wheelchair",
      "pluralName": "Wheelchairs",
      "svgIcon": "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"50\" height=\"50\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 50 50\"><path fill=\"currentColor\" d=\"M16.783 9c2.219 0 4-1.805 4-4 0-2.219-1.781-4-4-4-2.206 0-4 1.782-4 4 0 2.195 1.794 4 4 4zm2.824 36.675c-6.812 0-12.336-5.601-12.336-12.537 0-3.797 1.689-7.185 4.324-9.489l-.219-3.922C6.964 22.529 4 27.458 4 33.138 4 41.89 10.983 49 19.607 49 25.953 49 31.562 44.529 34 39l-2.376-3.272c-1.174 5.665-6.09 9.947-12.017 9.947zM44 38h-2l-8-11c-.433-.761-2-3-4-3h-9v-4h8c1.036 0 2.154-.441 2.154-1.506C31.154 17.437 30.065 17 29 17h-8v-4c-.147-2.218-2-3-3.99-2.954C15 10.092 14 11 14 13v14c.19 2.246 1.807 3 4 3h12l7 9c.451.746 2 3 2 3h5c1.032 0 2-.938 2-2 0-1.057-.936-2-2-2z\"/></svg>"
    },
    "visibility": true,
    "createdAt": new Date("2024-05-08T19:42:59.881851Z"),
    "instancesCount": 1,
    "bookedBy": [],
    "takenBy": []
  },
  {
    "id": 4,
    "name": "Lift",
    "description": "",
    "category": {
      "id": 4,
      "singularName": "Lift",
      "pluralName": "Lifts",
      "svgIcon": "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"50\" height=\"50\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 50 50\"><path fill=\"currentColor\" d=\"M42.599 37.17a3.457 3.457 0 002.224-4.381l-1.333.426a2.088 2.088 0 01-1.332 2.633L7.128 47.689 7.579 49l35.02-11.83zM10.343 16.708a3.608 3.608 0 002.461-4.479c-.562-1.911-2.582-3.004-4.51-2.447-1.927.557-3.039 2.567-2.466 4.479.562 1.912 2.577 3.005 4.515 2.447zm-1.487 5.003c-1.917-3.626 3.584-6.564 5.61-3.047l3.95 7.451 7.521-2.121c1.244-.35 2.963.995 2.963 2.578l.042 10.619c.012 2.632-3.93 2.643-3.93-.021-.012-2.47-.077-7.734-.077-7.734l-7.848 2.337c-1.718.492-3.139-.359-3.81-1.616l-4.421-8.446zM21 23.394V1h-2v22.82zM5.244 26.551c-1.079-2.108 1.707-3.506 2.786-1.398l3.397 6.598a4.366 4.366 0 003.844 2.295c.517 0 1.001-.132 1.475-.23l4.28-1.244c2.269-.678 3.149 2.292.86 2.961l-4.502 1.298a7.268 7.268 0 01-2.147.316 7.451 7.451 0 01-6.634-4.008l-3.359-6.588z\"/></svg>"
    },
    "visibility": true,
    "createdAt": new Date("2024-05-08T19:42:59.881851Z"),
    "instancesCount": 1,
    "bookedBy": [],
    "takenBy": [
      {
        "id": 6,
        "firstName": "Zakhar2",
        "lastName": "Kot",
        "phone": "+1234567890",
        "email": "z2@m.c",
        "roleIds": null
      }
    ]
  },
  {
    "id": 5,
    "name": "Tonometer",
    "description": "",
    "category": {
      "id": 5,
      "singularName": "Tonometer",
      "pluralName": "Tonometers",
      "svgIcon": "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"16\" height=\"16\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 16 16\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053.918 3.995.78 5.323 1.508 7H.43c-2.128-5.697 4.165-8.83 7.394-5.857.06.055.119.112.176.171a3.12 3.12 0 01.176-.17c3.23-2.974 9.522.159 7.394 5.856h-1.078c.728-1.677.59-3.005.108-3.947C13.486.878 10.4.28 8.717 2.01L8 2.748ZM2.212 10h1.315C4.593 11.183 6.05 12.458 8 13.795c1.949-1.337 3.407-2.612 4.473-3.795h1.315c-1.265 1.566-3.14 3.25-5.788 5-2.648-1.75-4.523-3.434-5.788-5Zm8.252-6.686a.5.5 0 00-.945.049L7.921 8.956 6.464 5.314a.5.5 0 00-.88-.091L3.732 8H.5a.5.5 0 000 1H4a.5.5 0 00.416-.223l1.473-2.209 1.647 4.118a.5.5 0 00.945-.049l1.598-5.593 1.457 3.642A.5.5 0 0012 9h3.5a.5.5 0 000-1h-3.162l-1.874-4.686Z\"/></svg>"
    },
    "visibility": true,
    "createdAt": new Date("2024-05-08T19:42:59.881851Z"),
    "instancesCount": 3,
    "bookedBy": [],
    "takenBy": [
      {
        "id": 9,
        "firstName": "Test",
        "lastName": "Test",
        "phone": "+48123456789",
        "email": "test@test.test",
        "roleIds": null
      },
      {
        "id": 6,
        "firstName": "Zakhar2",
        "lastName": "Kot",
        "phone": "+1234567890",
        "email": "z2@m.c",
        "roleIds": null
      }
    ]
  },
  {
    "id": 6,
    "name": "Walker",
    "description": "",
    "category": {
      "id": 6,
      "singularName": "Walker",
      "pluralName": "Walkers",
      "svgIcon": "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"24\" height=\"24\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 24 24\"><circle cx=\"12.5\" cy=\"4.5\" r=\"2\" fill=\"currentColor\"/><path fill=\"currentColor\" d=\"m19.77 17.72-.64-6.37A1.49 1.49 0 0017.64 10H16c-1.5-.02-2.86-.54-3.76-1.44l-2-1.98A1.95 1.95 0 008.83 6c-.51 0-1.02.2-1.41.59L4.08 9.91c-.53.68-.51 1.57-.21 2.13l1.43 2.8-3.15 4.05 1.57 1.24L7.4 15.4l-.17-1.36.77.71V20h2v-6.12l-2.12-2.12 2.36-2.36c.94.94 1.72 1.82 3.59 2.32L13 20h1.5l.41-3.5h3.18l.14 1.22c-.44.26-.73.74-.73 1.28 0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.54-.29-1.02-.73-1.28zM15.09 15l.41-3.5h2l.41 3.5h-2.82z\"/></svg>"
    },
    "visibility": true,
    "createdAt": new Date("2024-05-08T19:42:59.881851Z"),
    "instancesCount": 0,
    "bookedBy": [],
    "takenBy": []
  },
  {
    "id": 7,
    "name": "Stethoscope",
    "description": "",
    "category": {
      "id": 7,
      "singularName": "Stethoscope",
      "pluralName": "Stethoscopes",
      "svgIcon": "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"24\" height=\"24\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M19 8c.56 0 1 .43 1 1a1 1 0 01-1 1c-.57 0-1-.45-1-1 0-.57.43-1 1-1M2 2v9c0 2.96 2.19 5.5 5.14 5.91.62 3.01 3.28 5.09 6.36 5.09a6.5 6.5 0 006.5-6.5v-3.69c1.16-.42 2-1.52 2-2.81a3 3 0 00-3-3 3 3 0 00-3 3c0 1.29.84 2.4 2 2.81v3.6c0 2.5-2 4.5-4.5 4.5-2 0-3.68-1.21-4.28-3.01C12 16.3 14 13.8 14 11V2h-4v3h2v6a4 4 0 01-4 4 4 4 0 01-4-4V5h2V2H2Z\"/></svg>"
    },
    "visibility": true,
    "createdAt": new Date("2024-05-08T19:42:59.881851Z"),
    "instancesCount": 0,
    "bookedBy": [],
    "takenBy": []
  }
];