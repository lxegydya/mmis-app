<script>
	import Sidebar from '../../../../components/sidebar.svelte';
	import Navbar from '../../../../components/navbar.svelte';
    import Footer from '../../../../components/footer.svelte';
	import jquery from 'jquery';
	import ApiController from '../../../../ApiController';

    let createBatch = () => {
        ApiController({
            method:"POST",
            endpoint:`batch/create`,
            datas:{
                batch_name:jquery('#batch-name').val(),
                batch_start:jquery('#batch-start').val(),
                batch_end:jquery('#batch-end').val()
            }
        }).then(response => {
            if(response?.data.msg == 'success'){
                alert('Batch Created!')
                window.location.href = '/super-admin/batch'
            }
        })
    }

</script>

<svelte:head>
	<title>Batches | Create</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="batch" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
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
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Batches /</span
					> Create
				</h4>
				<div class="row">
					<div class="col-md-6">
						<div class="card mb-4">
							<div class="card-header d-flex justify-content-between align-items-center">
								<h5 class="mb-0">Create Batch</h5>
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
                                            placeholder="Batch 01"
                                        />
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="basic-icon-default-company">Batch Start</label>
                                    <div class="input-group input-group-merge">
                                        <input type="date" id="batch-start" class="form-control"/>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="basic-icon-default-company">Batch End</label>
                                    <div class="input-group input-group-merge">
                                        <input
                                            type="date"
                                            id="batch-end"
                                            class="form-control"
                                        />
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary" on:click={() => {
                                    createBatch()
                                }}>Send</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
        <Footer/>
	</div>
</div>
