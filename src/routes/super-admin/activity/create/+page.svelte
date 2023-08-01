<script>
// @ts-nocheck

    import Sidebar from "../../../../components/sidebar.svelte";
    import Navbar from "../../../../components/navbar.svelte";
	import Footer from "../../../../components/footer.svelte";
	import ApiController from "../../../../ApiController";
	import { onMount } from "svelte";
    import jquery from "jquery";

    let batches = null
    let programs = null
    let types = null
    let status = false

    let getDropdownItem = () => {
        ApiController({
            method:"GET",
            endpoint:'activity/dropdown-item'
        }).then(response => {
            programs = response?.data.data.programs
            types = response?.data.data.types
            console.log(programs)
            status = true
        })
    }

    let createActivity = () => {
		if(jquery('#name').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Activity Name!",
				icon: "error",
				button: {
					text : 'Okay!',
					value : true,
					visible : true,
					className : 'btn btn-primary',
					closeModal : true
				}
			})
        }

		if(jquery('#date').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Activity Date!",
				icon: "error",
				button: {
					text : 'Okay!',
					value : true,
					visible : true,
					className : 'btn btn-primary',
					closeModal : true
				}
			})
        }

		if(jquery('#activity').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please Choose Type!",
				icon: "error",
				button: {
					text : 'Okay!',
					value : true,
					visible : true,
					className : 'btn btn-primary',
					closeModal : true
				}
			})
        }

		if(jquery('#program').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please Choose Program!",
				icon: "error",
				button: {
					text : 'Okay!',
					value : true,
					visible : true,
					className : 'btn btn-primary',
					closeModal : true
				}
			})
        }

        ApiController({
            method:"POST",
            endpoint:'activity/create',
            datas:{
                name:jquery('#name').val(),
                date:jquery('#date').val(),
                program_id:jquery('#program').val(),
                type_id:jquery('#activity').val()
            }
        }).then(response => {
			if(response.data.msg == 'success'){
				swal({
                    title : "Data Created Successfully!", 
                    text : "Your new Activity data has been saved!", 
                    icon: "success",
                    button: {
                        text : 'Okay!',
                        value : true,
                        visible : true,
                        className : 'btn btn-primary',
                        closeModal : true
                    }
                }).then(() => {
                    window.location.href = '/super-admin/activity'
                })
			}
		})
    }

    onMount(async () => {
        getDropdownItem()
    })
</script>

<svelte:head>
	<title>Activities | Create</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="activity" role='admin'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='admin'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.location.href = '/super-admin/activity'
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Activities /</span
					> Create
				</h4>
                {#if status}
				<div class="row">
					<div class="col-md-6">
						<div class="card mb-4">
							<div class="card-header d-flex justify-content-between align-items-center">
								<h5 class="mb-0">Create Activity</h5>
							</div>
							<div class="card-body">
								<div class="mb-3">
									<label class="form-label" for="name">Activity Name</label>
									<div class="input-group input-group-merge">
										<input type="text" class="form-control" id="name" placeholder="Activity Name">
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="date">Activity Date</label>
									<div class="input-group input-group-merge">
										<input type="date" class="form-control" id="date">
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="activity">Activity Type</label>
									<div class="input-group input-group-merge">
										<select class="form-select" id="activity">
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
								<button class="btn btn-outline-secondary" on:click={() => window.location.href = '/super-admin/activity'}>Cancel</button>
								<button
									type="submit"
									class="btn btn-primary"
									on:click={() => {
                                        createActivity()
									}}>Create</button>
							</div>
						</div>
					</div>
				</div>
                {/if}
			</div>
		</div>
		<Footer/>
	</div>
</div>