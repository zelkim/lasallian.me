// export const validateEventFields = (data) => {
//     const required = [
//         'organization', 'committee', 'startDate',
//         'endDate', 'registrationLink', 'venue'
//     ]
//     return required.filter(field => !data[field])
// }

// TODO: if will use OSS
export const validateMedia = (media) => {
    return media?.every(item =>
        typeof item === 'string' &&
        item.startsWith('https://oss.example.com/')
    )
}

export const validatePostInput = (data, type) => {
    const errors = []
    if (!data.title) errors.push('title')
    if (!data.content) errors.push('content')
    // if (data.media?.length > 4) errors.push('Maximum 4 media items allowed')

    if (type === 'normal' && typeof data.showToPartners !== true) {
        errors.push('showToPartners required for posts')
    }

    return errors.length > 0 ? errors : null
}
