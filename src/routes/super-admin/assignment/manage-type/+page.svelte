<script>
// @ts-nocheck

    import Sidebar from "../../../../components/sidebar.svelte";
    import Navbar from "../../../../components/navbar.svelte";
    import Footer from "../../../../components/footer.svelte";
    import ApiController from "../../../../ApiController";
	import { onMount } from "svelte";
	import jquery from "jquery";
	import returnNada from "../../../../CustomReturnNada";
	import pagination from "../../../../CustomPagination";
    import Pagination from "../../../../components/pagination.svelte";

    let currentPage = 1
    let showRowData = 10

    let dataReal = null
    let data = null
    let status = false
    let detail = null
    let modalStatus = false
    let modalType = ""

    let getType = () => {
        jquery('#type').val("")
        ApiController({
            method:"GET",
            endpoint:'assignment/type/get'
        }).then(response => {
            dataReal = response.data.data
            data = dataReal
            status = true
        })
    }

    let filterType = () => {
        currentPage = 1
        data = dataReal
        let tempData = data
        let targetType = jquery('#filter-type').val().toLowerCase()

        tempData = tempData.filter(m => {
            return m.type.toLowerCase().includes(targetType)
        })

        data = tempData
    }

    let getDetail = (id, btnId) => {
        if(modalStatus == false){
            jquery(`#${btnId}`).attr('data-bs-toggle', 'modal')
            jquery(`#${btnId}`).attr('data-bs-target', '#modalCenter')
            
            modalStatus = true
            jquery(`#${btnId}`).click()
        }else{
            ApiController({
                method:"GET",
                endpoint:`assignment/type/get/${id}`
            }).then(response => {
                detail = response.data.data
            })
        }
    }

    let updateType = () => {
        if(modalStatus){
            jquery('#btn-close').attr('data-bs-dismiss', 'modal')
            modalStatus = false
            jquery('#btn-close').click()
        }else{
            ApiController({
                method:"POST",
                endpoint:'assignment/type/update',
                datas:{
                    id:detail.id,
                    type:jquery('#type').val()
                }
            }).then(response => {
                if(response.data.msg == 'success'){
                    swal({
                        title : "Data Updated Successfully!", 
                        text : "Your Assignment Type data has been Updated!", 
                        icon: "success",
                        button: {
                            text : 'Okay!',
                            value : true,
                            visible : true,
                            className : 'btn btn-primary',
                            closeModal : true
                        }
                    })
                    getType()
                }
            })
        }
    }

    let saveType = () => {
        if(modalStatus){
            jquery('#btn-close').attr('data-bs-dismiss', 'modal')
            modalStatus = false
            jquery('#btn-close').click()
        }else{
            ApiController({
                method:"POST",
                endpoint:'assignment/type/create',
                datas:{
                    type:jquery('#type').val()
                }
            }).then(response => {
                if(response.data.msg == 'success'){
                    swal({
                        title : "Data Created Successfully!", 
                        text : "Your new Assignment Type data has been saved!", 
                        icon: "success",
                        button: {
                            text : 'Okay!',
                            value : true,
                            visible : true,
                            className : 'btn btn-primary',
                            closeModal : true
                        }
                    })
                    getType()
                }
            })
        }
    }

    let deleteType = id => {
        swal({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover this data!",
			icon: "warning",
			buttons:{
				cancel : {
					text : 'No!',
					value : null,
					visible : true,
					className : 'btn btn-outline-secondary',
					closeModal : true
				},
				confirm : {
					text : 'Yes Sure!',
					value : true,
					visible : true,
					className : 'btn btn-primary',
					closeModal : true
				}
			}
		}).then((willDelete) => {
			if (willDelete) {
                ApiController({
                    method:"POST",
                    endpoint:'assignment/type/delete',
                    datas:{id}
                }).then(response => {
                    if(response.data.msg == 'success'){
                        swal("Poof! Data has been deleted!", {
							icon: "success",
							button: {
								text : 'Okay!',
								value : true,
								visible : true,
								className : 'btn btn-primary',
								closeModal : true
							}
						})
                        getType()
                    }
                })
            }
        })
    }

    onMount(async () => {
        getType()
    })
</script>

<svelte:head>
	<title>Assignments | Manage Type</title>
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
							window.location.href = '/super-admin/assignment'
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Assignments /</span
					> Manage Type
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-6">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Type of Assignments</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-type" placeholder="Type Name" on:keyup={() => filterType()}>
                                    </div>
                                    <button id="btn-add" type="button" class="btn btn-primary text-nowrap" on:click={() => {
                                        modalType = "add"
                                        jquery(`#btn-add`).attr('data-bs-toggle', 'modal')
                                        jquery(`#btn-add`).attr('data-bs-target', '#modalCenter')
                                        
                                        modalStatus = true
                                        jquery(`#btn-add`).click()
                                    }}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Type
                                    </button>
                                </div>
                            </div>
							<div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>NO.</th>
											<th>Type</th>
											<th class="text-center">Action</th>
										</tr>
									</thead>
                                    <tbody>
                                    {#if pagination(data, currentPage, showRowData).length == 0}
                                    {returnNada(currentPage = currentPage-1)}
                                    {/if}
                                    {#each data as d, i}
                                    <tr>
                                        <td>{i+1}</td>
                                        <td>{d.type}</td>
                                        <td class="text-center">
                                            <button id="btn-edit-{d.id}" class="btn btn-sm btn-outline-warning" on:click={() => {
                                                modalType = "edit"
                                                getDetail(d.id, `btn-edit-${d.id}`)
                                            }}>Edit</button>
                                            <button class="btn btn-sm btn-outline-danger" on:click={() => {
                                                deleteType(d.id)
                                            }}>Delete</button>
                                        </td>
                                    </tr>
                                    {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="modalCenter" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modalCenterTitle">{modalType != 'edit' ? 'Create New Activity Type' : 'Edit Activity Type'}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={() => {
                                    if(modalType == 'edit'){
                                        detail = null
                                    }
                                    modalType = ''
                                    modalStatus = false
                                }}></button>
                            </div>
                            {#if modalType == 'edit' && detail != null}
                            <div class="modal-body">
                                <div class="mb-0">
									<label class="form-label" for="name">Type Name</label>
									<div class="input-group input-group-merge">
										<input type="text" class="form-control" id="type" placeholder="Type Name" value="{detail.type}">
									</div>
								</div>
                            </div>
                            <div class="modal-footer">
                                <button id="btn-close" type="button" class="btn btn-primary" on:click={() => {
                                    updateType()
                                }}>Save changes</button>
                            </div>
                            {:else if modalType == 'add'}
                            <div class="modal-body">
                                <div class="mb-0">
									<label class="form-label" for="name">Type Name</label>
									<div class="input-group input-group-merge">
										<input type="text" class="form-control" id="type" placeholder="Type Name">
									</div>
								</div>
                            </div>
                            <div class="modal-footer">
                                <button id="btn-close" type="button" class="btn btn-primary" on:click={() => {
                                    saveType()
                                }}>Create</button>
                            </div>
                            {:else}
                            <div class="modal-body">
                                <div class="d-flex flex-column gap-2 justify-content-center align-items-center">
                                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                            {/if}
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>
<div class="content-backdrop fade"></div>