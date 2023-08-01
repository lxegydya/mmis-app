<script>
	// @ts-nocheck

	import Sidebar from '../../../../../components/sidebar.svelte';
	import Navbar from '../../../../../components/navbar.svelte';
	import Footer from '../../../../../components/footer.svelte';
	import { onMount } from 'svelte';
	import jquery from 'jquery';
	import ApiController from '../../../../../ApiController';

	export let data;

	let program = null;
	let batchList = null

	let getProgram = () => {
		ApiController({
			method: 'GET',
			endpoint: `program/${data.params.slug}`
		}).then((response) => {
			// @ts-ignore
			program = response.data.data
		})
	}

    let updateProgram = () => {
		if(jquery('#batch-name').val() == ''){
            return swal({
				title: "Opps, you forgot something!",
				text: "Please insert Batch Name!",
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

		if(jquery('#program-desc').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Description of Program!",
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

		if(jquery('#program-category').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Program Categories!",
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
            endpoint:`program/edit`,
            datas:{
                program_id:data.params.slug,
                program_name:jquery('#program-name').val(),
                program_desc:jquery('#program-desc').val(),
                program_categorie:jquery('#program-category').val(),
                program_status:jquery('#program-status').val(),
                batch_id:jquery('#program-batch').val()
            }
        }).then(response => {
            if(response?.data.msg == 'success'){
                swal({
					title : "Data Updated Successfully!", 
					text : "Your Program data has been updated!", 
					icon : "success",
					button: {
						text : 'Okay!',
						value : true,
						visible : true,
						className : 'btn btn-primary',
						closeModal : true
					}
				}).then(() => {
                    window.location.href = '/super-admin/program'
                })
            }
        })
    }

	onMount(async () => {
		ApiController({
            method:"GET",
            endpoint:`batchs`
        }).then(response => {
            batchList = response.data.data
        })

		getProgram();
	});
</script>

<svelte:head>
	<title>Programs | Edit</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="program" role='admin'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='admin'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.history.back();
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Programs /</span
					> Edit
				</h4>
				{#if program != null}
				<div class="row">
					<div class="col-md-6">
						<div class="card mb-4">
							<div class="card-header d-flex justify-content-between align-items-center">
								<h5 class="mb-0">Edit Program</h5>
							</div>
							<div class="card-body">
								<div class="mb-3">
									<label class="form-label" for="program-name">Program Name</label>
									<div class="input-group input-group-merge">
										<input type="text" class="form-control" id="program-name" value="{program.program_name}">
									</div>
								</div>
								<div class="mb-3">
									<label class="form-label" for="program-desc">Program Description</label>
									<div class="input-group input-group-merge">
										<textarea class="form-control" id="program-desc" rows="3">{program.program_desc}</textarea>
									</div>
								</div>
								<div class="mb-3">
									<label class="form-label" for="program-category">Program Category</label>
									<div class="input-group input-group-merge">
										<input type="text" class="form-control" id="program-category" value="{program.program_categorie}">
									</div>
								</div>
								<div class="mb-3">
									<label class="form-label" for="program-status">Program Status</label>
									<div class="input-group input-group-merge">
										<select id="program-status" class="form-select">
											<option selected hidden>Choose Status</option>
											<option value="Upcoming" selected={program.program_status == 'Upcoming' ? true : false}>Upcoming</option>
											<option value="Ongoing" selected={program.program_status == 'Ongoing' ? true : false}>Ongoing</option>
											<option value="Finished" selected={program.program_status == 'Finished' ? true : false}>Finished</option>
										</select>
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="program-batch">Program Batch</label>
									<div class="input-group input-group-merge">
										<select id="program-batch" class="form-select">
											<option selected hidden>Choose Batch</option>
											{#if batchList != null}
                                            {#each batchList as b}
											<option value="{b.id}" selected={b.id == program.batch_id ? true : false}>{b.batch_name} ({b.batch_status})</option>
                                            {/each}
											{/if}
										</select>
									</div>
								</div>
								<button class="btn btn-outline-secondary" on:click={() => {
                                    window.location.href = '/super-admin/program'
                                }}>Cancel</button>
								<button type="submit" class="btn btn-primary" on:click={() => {
									updateProgram();
								}}>Save Changes</button>
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
