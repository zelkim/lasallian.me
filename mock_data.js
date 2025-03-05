// Normal post
const normalPost = {
    title: "My Normal Post",
    content: { text: "This is a personal post" },
    type: "normal"
}

// Project post
const projectPost = {
    title: "My Project",
    content: {
        text: "Project description",
        technologies: ["React", "Node.js"],
        github: "https://github.com/..."
    },
    type: "project"
}

// Event post
const eventPost = {
    title: "Organization Event",
    content: {
        description: "Event details",
        date: "2024-03-20",
        location: "DLSU"
    },
    type: "event",
    organization: "organization_id_here",
    visibility: "organization" // or "public"
}
    ```
