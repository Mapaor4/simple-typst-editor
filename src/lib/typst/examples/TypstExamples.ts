export interface TypstExample {
	id: string
	name: string
	description: string
	filePath: string // Path to .typ file in public folder
}

export const TYPST_EXAMPLES: TypstExample[] = [
	{
		id: 'hello',
		name: 'Hello World',
		description: 'A simple document with headings and text',
		filePath: '/typst-examples/hello.typ'
	},
	{
		id: 'math',
		name: 'Math Document',
		description: 'Mathematical formulas and equations',
		filePath: '/typst-examples/math.typ'
	},
	{
		id: 'report',
		name: 'Academic Report',
		description: 'A structured document with sections and formatting',
		filePath: '/typst-examples/report.typ'
	}
]

/**
 * Fetches a Typst example file from the public folder
 */
export async function fetchExample(filePath: string): Promise<string> {
	const response = await fetch(filePath)
	if (!response.ok) {
		throw new Error(`Failed to load example: ${response.statusText}`)
	}
	return await response.text()
}

export function getExampleById(id: string): TypstExample | undefined {
	return TYPST_EXAMPLES.find(example => example.id === id)
}

export function getExampleNames(): { id: string; name: string }[] {
	return TYPST_EXAMPLES.map(({ id, name }) => ({ id, name }))
}
