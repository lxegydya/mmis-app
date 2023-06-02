<script>
    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
</script>

<div class="d-flex h-100">
	<Sidebar activePage="program" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">Programs</h4>
				<div class="row"></div>
            </div>
        </div>
    </div>
</div>