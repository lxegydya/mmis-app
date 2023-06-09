<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
	import Navbar from "../../../../../components/navbar.svelte";
	import ApiController from "../../../../../ApiController";
	import { onMount } from "svelte";
    import jquery from "jquery";

	export let data

	let detail = null
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
            status = true
        })
    }

	let getDetail = () => {
		ApiController({
			method:"POST",
			endpoint:`activity/detail`,
			datas:{id:data.params.slug}
		}).then(response => {
			detail = response.data.data
			getDropdownItem()
		})
	}

    let updateActivity = () => {
        ApiController({
            method:"POST",
            endpoint:'activity/update',
            datas:{
				id:data.params.slug,
                name:jquery('#name').val(),
                date:jquery('#date').val(),
                program_id:jquery('#program').val(),
                type_id:jquery('#activity').val()
            }
        }).then(response => {
			if(response.data.msg == 'success'){
				alert('Activity Updated!')
				window.location.href = '/super-admin/activity'
			}
		})
    }

    onMount(async () => {
        getDetail()
    })
</script>

<svelte:head>
	<title>Activities | Edit</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="program" />
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
							window.history.back();
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Activities /</span
					> Edit
				</h4>
                {#if status}
				<div class="row">
					<div class="col-md-6">
						<div class="card mb-4">
							<div class="card-header d-flex justify-content-between align-items-center">
								<h5 class="mb-0">Edit Activity</h5>
							</div>
							<div class="card-body">
								<div class="mb-3">
									<label class="form-label" for="name">Activity Name</label>
									<div class="input-group input-group-merge">
										<input type="text" class="form-control" id="name" placeholder="Activity Name" value="{detail.name}">
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="date">Activity Date</label>
									<div class="input-group input-group-merge">
										<input type="date" class="form-control" id="date" value="{detail.date}">
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="activity">Activity Type</label>
									<div class="input-group input-group-merge">
										<select class="form-select" id="activity">
                                            <option value="" selected hidden>Select Type</option>
                                            {#each types as t}
                                            <option value="{t.id}" selected={detail.type_id == t.id ? true : false}>{t.type}</option>
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
                                            <option value="{p.id}" selected={detail.program_id == p.id ? true : false}>[{p.batch_name}] {p.program_name}</option>
                                            {/each}
                                        </select>
									</div>
								</div>
								<button
									type="submit"
									class="btn btn-primary"
									on:click={() => {
                                        updateActivity()
									}}>Save Changes</button>
							</div>
						</div>
					</div>
				</div>
                {/if}
			</div>
		</div>
	</div>
</div>