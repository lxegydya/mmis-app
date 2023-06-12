<script>
// @ts-nocheck

    import Sidebar from "../../../../components/sidebar.svelte";
    import Navbar from "../../../../components/navbar.svelte";
    import Footer from "../../../../components/footer.svelte";
    import jquery from "jquery";
	import { onMount } from "svelte";
	import ApiController from "../../../../ApiController";

    let status = false

    let programs = null
    let types = null

    let getData = () => {
        ApiController({
            method:"GET",
            endpoint:'assignment/get-preparation-data'
        }).then(response => {
			console.log(response)
            programs = response?.data.data.programs
            types = response?.data.data.types
            status = true
        })
    }

    let createAssignment = () => {
		ApiController({
            method:"POST",
            endpoint:'assignments/add',
			datas:{
				name:jquery('#name').val(),
				description:jquery('#description').val(),
				deadline:jquery('#deadline').val(),
				type:jquery('#type').val(),
				program:jquery('#program').val()
			}
        }).then(response => {
            if(response.data.msg == 'success'){
				alert("Assignment Created!")
				window.location.href = '/super-admin/assignment'
			}
        })
    }

    onMount(async () => {
        getData()
    })

</script>

<svelte:head>
    <title>Assignments | Create</title>
    <html lang="en" />
</svelte:head>

<div class="d-flex h-100">
    <Sidebar activePage="assignment" />
    <div class="w-100 d-flex flex-column">
        <Navbar />
        <div class="wrapper">
            <div class="container-xxl flex-grow-1 container-p-y">
                <h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.location.href = '/super-admin/assignment';
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Assignments /</span
					> Create
				</h4>
                {#if status}
				<div class="row">
					<div class="col-md-6">
						<div class="card mb-4">
							<div class="card-header d-flex justify-content-between align-items-center">
								<h5 class="mb-0">Create Assignment</h5>
							</div>
							<div class="card-body">
								<div class="mb-3">
									<label class="form-label" for="name">Title</label>
									<div class="input-group input-group-merge">
										<input type="text" class="form-control" id="name" placeholder="Activity Name">
									</div>
								</div>
								<div class="mb-3">
									<label class="form-label" for="description">Description</label>
									<div class="input-group input-group-merge">
										<textarea class="form-control" id="description" rows="3"></textarea>
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="deadline">Deadline</label>
									<div class="input-group input-group-merge">
										<input type="date" class="form-control" id="deadline">
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="type">Assignment Type</label>
									<div class="input-group input-group-merge">
										<select class="form-select" id="type">
                                            <option value="" selected hidden>Select Type</option>
                                            {#each types as t}
                                            <option value="{t.id}">{t.type}</option>
                                            {/each}
                                        </select>
									</div>
								</div>
								<div class="mb-3">
									<label class="form-label" for="program">Program</label>
									<div class="input-group input-group-merge">
										<select class="form-select" id="program">
                                            <option value="" selected hidden>Select Program</option>
                                            {#each programs as p}
                                            <option value="{p.id}">[{p.batch_name}] {p.program_name}</option>
                                            {/each}
                                        </select>
									</div>
								</div>
								<div class="d-flex justify-content-end gap-2">
									<button class="btn btn-outline-secondary" on:click={() => window.location.href = '/super-admin/assignment'}>Cancel</button>
									<button type="submit" class="btn btn-primary" on:click={() => {
										createAssignment()
										}}>Create
									</button>
								</div>
							</div>
						</div>
					</div>
					<Footer/>
				</div>
                {/if}
            </div>
        </div>
    </div>
</div>