<script>
	export let imageURL;
	export let prompt;
</script>

<div class="container">
	<img class="image" src={imageURL} alt={prompt} />
	<div class="overlay">
		<div class="text">
          {prompt}
        </div>
	</div>
</div>

<style lang="sass">
.container {
    position: relative;
    width: 16em;
    height: 16em;
}

.overlay {
    position: absolute;
    border-radius: 25px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: .5s ease;
    background-color: white;
}

.container:hover .overlay {
    opacity: .75;
  }


.text {
    color: black;
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: white;
  }
  
.image {
    width: 16em;
    height: 16em;
    border-radius: 25px;
}

</style>
