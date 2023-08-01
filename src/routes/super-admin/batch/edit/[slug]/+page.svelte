<script>
	// @ts-nocheck

	import Sidebar from '../../../../../components/sidebar.svelte';
	import Navbar from '../../../../../components/navbar.svelte';
	import Footer from '../../../../../components/footer.svelte';
	import { onMount } from 'svelte';
	import jquery from 'jquery';
	import ApiController from '../../../../../ApiController';

	export let data;

	let batch = null;

	let getBatch = () => {
		ApiController({
			method: 'GET',
			endpoint: `batch/${data.params.slug}`
		}).then((response) => {
			// @ts-ignore
			batch = response.data.data;
		});
	};

    let updateBatch = () => {
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

        ApiController({
            method:"POST",
            endpoint:`batch/edit`,
            datas:{
                batch_id:data.params.slug,
                batch_name:jquery('#batch-name').val(),
                batch_start:jquery('#batch-start').val(),
                batch_end:jquery('#batch-end').val(),
                batch_status:jquery('#batch-status').val()
            }
        }).then(response => {
            if(response?.data.msg == 'success'){
                swal({
					title : "Data Updated Successfully!", 
					text : "Your Batch data has been updated!", 
					icon : "success",
					button: {
						text : 'Okay!',
						value : true,
						visible : true,
						className : 'btn btn-primary',
						closeModal : true
					}
				}).then(() => {
                    window.location.href = '/super-admin/batch'
                })
            }
        })
    }

	onMount(async () => {
		getBatch();
	});
</script>

<svelte:head>
	<title>Batches | Edit</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="batch" role='admin'/>
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
							window.location.href = '/super-admin/batch'
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Batches /</span
					> Edit
				</h4>
				{#if batch != null}
					<div class="row">
						<div class="col-md-6">
							<div class="card mb-4">
								<div class="card-header d-flex justify-content-between align-items-center">
									<h5 class="mb-0">Edit Batch</h5>
								</div>
								<div class="card-body">
									<div class="mb-3">
										<label class="form-label" for="basic-icon-default-fullname">Batch Name</label>
										<div class="input-group input-group-merge">
											<span id="basic-icon-default-fullname2" class="input-group-text"
												><i class="bx bx-user" /></span
											>
											<input
												type="text"
												class="form-control"
												id="batch-name"
												value={batch.batch_name}
											/>
										</div>
									</div>
									<div class="mb-3">
										<label class="form-label" for="basic-icon-default-company">Batch Start</label>
										<div class="input-group input-group-merge">
											<input
												type="date"
												id="batch-start"
												class="form-control"
												value={batch.batch_start}
											/>
										</div>
									</div>
									<div class="mb-3">
										<label class="form-label" for="basic-icon-default-company">Batch End</label>
										<div class="input-group input-group-merge">
											<input
												type="date"
												id="batch-end"
												class="form-control"
												value={batch.batch_end}
											/>
										</div>
									</div>
									<div class="mb-3">
										<label for="batch-status" class="form-label">Status Batch</label>
										<select id="batch-status" class="form-select">
											<option value="Upcoming" selected={batch.batch_status == 'Upcoming' ? true : false}>Upcoming</option>
											<option value="Ongoing" selected={batch.batch_status == 'Ongoing' ? true : false}>Ongoing</option>
											<option value="Finished" selected={batch.batch_status == 'Finished' ? true : false}>Finished</option>
										</select>
									</div>
									<button class="btn btn-outline-secondary" on:click={() => window.location.href = '/super-admin/batch'}>Cancel</button>
									<button type="submit" class="btn btn-primary" on:click={() => updateBatch()}>Update Changes</button>
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
