import Airtable from 'airtable'

export default async function fetchPrice() {
    const base =  new Airtable({
        apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
    }).base(process.env.AIRTABLE_BASE_ID!);

    try {
        const records = await base('Pricing').select({
            fields: ['price'],
            maxRecords: 1 
        }).all()

        const pricing = records[0].fields.price

        if(!pricing) {
            throw new Error('Price not found in database')
        }

        return pricing
    } catch (error) {
        console.error('Error fetching price from database', error)
        throw error
    }

}