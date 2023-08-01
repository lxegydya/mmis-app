<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
	import Navbar from "../../../../../components/navbar.svelte";
	import Footer from "../../../../../components/footer.svelte";
	import ApiController from "../../../../../ApiController";
    import jquery from "jquery";
	import { onMount } from "svelte";

	export let data

    let status = false

	let detail = null
    let programs = null
    let types = null

    let getData = () => {
        ApiController({
            method:"GET",
            endpoint:'assignment/get-preparation-data'
        }).then(response => {
            programs = response?.data.data.programs
            types = response?.data.data.types
			getDetail()
        })
    }

	let getDetail = () => {
		ApiController({
			method:"GET",
			endpoint:`assignment/get/${data.params.slug}`
		}).then(response => {
			detail = response.data.data
			status = true
		})
	}

    let updateAssignment = () => {
		if(jquery('#name').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Assignment Title!",
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

		if(jquery('#desciption').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Description!",
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
            endpoint:'assignments/update',
			datas:{
				id:detail.id,
				name:jquery('#name').val(),
				description:jquery('#description').val(),
				deadline:jquery('#deadline').val(),
				type:jquery('#type').val(),
				program:jquery('#program').val()
			}
        }).then(response => {
            if(response.data.msg == 'success'){
				swal({
					title : "Data Updated Successfully!", 
					text : "Your Assignment data has been updated!", 
					icon : "success",
					button: {
						text : 'Okay!',
						value : true,
						visible : true,
						className : 'btn btn-primary',
						closeModal : true
					}
				}).then(() => {
                    window.location.href = '/super-admin/assignment'
                })
			}
        })
    }

    onMount(async () => {
        getData()
    })

</script>

<svelte:head>
    <title>Assignments | Edit</title>
    <html lang="en" />
</svelte:head>

<div class="d-flex h-100">
    <Sidebar activePage="assignment" role='admin'/>
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
							window.location.href = '/super-admin/assignment';
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Assignments /</span
					> Edit
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
										<input type="text" class="form-control" id="name" placeholder="Activity Name" value="{detail.name}">
									</div>
								</div>
								<div class="mb-3">
									<label class="form-label" for="description">Description</label>
									<div class="input-group input-group-merge">
										<textarea class="form-control" id="description" rows="3">{detail.description}</textarea>
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="deadline">Deadline</label>
									<div class="input-group input-group-merge">
										<input type="date" class="form-control" id="deadline" value="{detail.deadline}">
									</div>
								</div>
                                <div class="mb-3">
									<label class="form-label" for="type">Assignment Type</label>
									<div class="input-group input-group-merge">
										<select class="form-select" id="type">
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
								<div class="d-flex justify-content-end gap-2">
									<button class="btn btn-outline-secondary" on:click={() => window.location.href = '/super-admin/assignment'}>Cancel</button>
									<button type="submit" class="btn btn-primary" on:click={() => {
										updateAssignment()
										}}>Save Changes
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