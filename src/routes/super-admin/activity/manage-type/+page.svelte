<script>
// @ts-nocheck

    import Sidebar from "../../../../components/sidebar.svelte";
    import Navbar from "../../../../components/navbar.svelte";
    import Footer from "../../../../components/footer.svelte";
    import ApiController from "../../../../ApiController";
	import { onMount } from "svelte";
	import jquery from "jquery";
    import pagination from "../../../../CustomPagination";
    import Pagination from "../../../../components/pagination.svelte";
    import returnNada from "../../../../CustomReturnNada";

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
            endpoint:'type'
        }).then(response => {
            dataReal = response.data.data
            data = dataReal
            status = true
        })
    }

    let getDetail = (id, btnId) => {
        if(modalStatus == false){
            jquery(`#${btnId}`).attr('data-bs-toggle', 'modal')
            jquery(`#${btnId}`).attr('data-bs-target', '#modalCenter')
            
            modalStatus = true
            jquery(`#${btnId}`).click()
        }else{
            ApiController({
                method:"POST",
                endpoint:`type/detail`,
                datas:{id}
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
            if(jquery('#type').val() == ''){
                return swal({
                    title: "Oops, you forgot something!",
                    text: "Please insert Type!",
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
                endpoint:'type/update',
                datas:{
                    id:detail.id,
                    type:jquery('#type').val()
                }
            }).then(response => {
                if(response.data.msg == 'success'){
                    swal({
                        title : "Data Updated Successfully!", 
                        text : "Your Activity Type data has been updated!", 
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
            if(jquery('#type').val() == ''){
                return swal({
                    title: "Oops, you forgot something!",
                    text: "Please insert Type!",
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
                endpoint:'type/create',
                datas:{
                    type:jquery('#type').val()
                }
            }).then(response => {
                if(response.data.msg == 'success'){
                    swal({
                        title : "Data Created Successfully!", 
                        text : "Your new Activity Type data has been saved!", 
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
                    endpoint:'type/delete',
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

    onMount(async () => {
        getType()
    })
</script>

<svelte:head>
	<title>Activities | Manage Type</title>
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
							window.history.back();
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Activities /</span
					> Manage Activity Type
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-6">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Type of Activities</h5>
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
                                    {#each pagination(data, currentPage, showRowData) as d, i}
                                    <tr>
                                        <td>{(showRowData*(currentPage-1)) + i+1}</td>
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
                        <Pagination bind:dataList={data} bind:currentPage={currentPage} showRowData={showRowData} />
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