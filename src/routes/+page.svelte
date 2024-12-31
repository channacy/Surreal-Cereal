<script>
	import { onMount } from 'svelte';
	import Image from '$lib/components/Image.svelte';
	import { dataStore, fetchData, addData } from '$lib/store/dataStore';
	onMount(async () => {
		await fetchData('images');
	});

	let imageUrl = $state();
	let prompt = $state();
	let loading = $state();
	let error = $state();
	let data = $state(dataStore);

	async function generate() {
		if (!prompt.trim()) {
			error = 'Type in a prompt.';
			return;
		}

		loading = true;
		let refinedPrompt = `Design a cheerful and vibrant cereal box showing ${prompt}. Show the entire one box facing foward on a table with bright lighting.`;

		try {
			const response = await fetch('/api/image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ refinedPrompt })
			});

			const imgResult = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to generate image.');
			}
			imageUrl = imgResult.secure_url;
			let newData = { imageUrl: imageUrl, prompt: prompt };
			await addData(newData);
		} catch (err) {
			console.error(err);
			error = err.message;
		} finally {
			loading = false;
		}
	}
</script>

<div class="main">
	<h1 id="title">Surreal Cereal</h1>
	<p id="desc">Generate unique cereal box images using DALL-E.</p>
	<div class="inputContainer">
		<input bind:value={prompt} id="inputField" type="text" placeholder="Enter your cereal box description here..."/>
		<button id="genBtn" onclick={generate}>{loading ? 'Generating...' : 'Generate'}</button>
	</div>
{#if error !== undefined}
	<p>{error}</p>
{/if}

{#if imageUrl !== undefined}
	<Image id="currentImg" imageURL={imageUrl} prompt={prompt} />
{/if}

{#if $data.length > 0}
<div class="gallery">
	{#each $data as item}
		<Image imageURL={item.imageUrl} prompt={item.prompt}/>
	{/each}
</div>

{:else}
	<p>Loading...</p>
{/if}
</div>