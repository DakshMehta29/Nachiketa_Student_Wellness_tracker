import { useEffect, useState } from 'react';

type Spec = { type: 'bar' | 'line'; title: string; labels: string[]; values: number[] };

export default function Visualization() {
	const [spec, setSpec] = useState<Spec | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function generate() {
		setLoading(true);
		setError(null);
		try {
			const userContext = { sleepHours: [7, 6, 8, 5, 7], workouts: [1, 0, 1, 1, 0], mood: [8, 7, 9, 6, 8] };
			const resp = await fetch('/api/visualize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userContext })
			});
			// Check if response is ok before parsing JSON
			if (!resp.ok) {
				const errorText = await resp.text();
				throw new Error(errorText || `Server responded with status: ${resp.status}`);
			}
			const data = await resp.json();
			setSpec(data.spec as Spec);
		} catch (e: any) {
			console.error('Visualization error:', e);
			// Provide fallback data when API is unavailable
			setSpec({
				type: 'bar',
				title: 'Wellness Overview (Fallback)',
				labels: ['Sleep', 'Exercise', 'Mood'],
				values: [7, 4, 8]
			});
			setError('Could not connect to server - showing sample data');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		generate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section className="py-20 bg-white dark:bg-gray-900">
			<div className="container mx-auto px-4 max-w-4xl">
				<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Personalized Visualization</h2>
				<div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
					{loading && <div className="text-gray-600 dark:text-gray-300">Generating…</div>}
					{error && <div className="text-red-600">{error}</div>}
					{!loading && !error && spec && (
						<div>
							<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{spec.title}</h3>
							<div className="w-full overflow-x-auto">
								<svg width="100%" height="240">
									{spec.type === 'bar' && (
										<g>
											{spec.values.map((v, i) => {
												const width = 40;
												const gap = 20;
												const x = i * (width + gap) + 10;
												const h = Math.max(2, v * 10);
												const y = 200 - h;
												return (
													<g key={i}>
														<rect x={x} y={y} width={width} height={h} fill="#3b82f6" rx={6} />
														<text x={x + width / 2} y={215} textAnchor="middle" fontSize="12" fill="#9ca3af">{spec.labels[i]}</text>
													</g>
												);
											})}
										</g>
									)}
								</svg>
							</div>
						</div>
					)}
					<div className="mt-4">
						<button onClick={generate} className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Regenerate</button>
					</div>
				</div>
			</div>
		</section>
	);
}


