export const validateEventFields = (data) => {
    const required = [
        'organization', 'committee', 'startDate',
        'endDate', 'registrationLink', 'venue'
    ]
    return required.filter(field => !data[field])
}

export const validateMedia = (media) => {
    return media?.every(item =>
        typeof item === 'string' &&
        item.startsWith('https://oss.example.com/')
    )
}
