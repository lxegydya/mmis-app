<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
    import Navbar from "../../../../../components/navbar.svelte";
    import Footer from "../../../../../components/footer.svelte";
	import { onMount } from "svelte";
	import ApiController from "../../../../../ApiController";
    import jquery from "jquery";
    import Pagination from "../../../../../components/pagination.svelte";
    import pagination from "../../../../../CustomPagination";
    import returnNada from "../../../../../CustomReturnNada";

    export let data

    let currentPage = 1
    let showRowData = 10

    let menteesReal = null
    let mentees = null
    let status = false

    let assignStatus = false

    let selectedMentee = []

    let getMenteesNotInGroup = () => {
        ApiController({
            method:'GET',
            endpoint:`mentee/not-in-group`
        }).then(response => {
            menteesReal = response?.data.data.sort((a,b) => a.name < b.name ? -1 : 1)

            menteesReal.forEach(m => {
                m.cssClass = ''
            })

            mentees = menteesReal
            status = true
        })
    }

    let assignMentee = () => {
        ApiController({
            method:"POST",
            endpoint:`mentee/assign`,
            datas:{
                mentees:selectedMentee.map(m => m.id),
                group_id:data.params.slug
            }
        }).then(response => {
            if(response.data.msg == 'success'){
                swal({
                    title : "Assigned Successfully!", 
                    text : "Your Mentee have been assigned to the selected Group!", 
                    icon: "success",
                    button: {
                        text : 'Okay!',
                        value : true,
                        visible : true,
                        className : 'btn btn-primary',
                        closeModal : true
                    }
                }).then(() => {
                    window.location.href = `/super-admin/group/detail/${data.params.slug}`
                })
            }
        })
    }

    let filterMentee = () => {
        currentPage = 1
        mentees = menteesReal
        let tempMentees = mentees
        let targetName = jquery('#filter-name').val().toLowerCase()

        tempMentees = tempMentees.filter(m => {
            return m.name.toLowerCase().includes(targetName)
        })

        mentees = tempMentees
    }

    onMount(async () => {
        getMenteesNotInGroup()
    })
</script>

<svelte:head>
	<title>Groups | Assign</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="group" role='admin'/>
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
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Groups / Detail /</span
					> Assign
				</h4>
                {#if status}
                <div class="col-md-12 col-lg-12 mb-3">
                    <div class="card">
                        <div class="d-flex align-items-center justify-content-between">
                            <h5 class="card-header">Mentees</h5>
                            <div class="card-header d-flex flex-row align-items-center gap-3">
                                <div class="input-group input-group-merge">
                                    <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
                                    <input type="text" class="form-control" placeholder="Mentee Name" id="filter-name" on:keyup={() => {filterMentee()}}>
                                </div>
                                {#if selectedMentee.length > 0}
                                <button type="button" class="btn btn-primary text-nowrap" on:click={() => assignMentee()}>
                                    <span class="tf-icons bx bx-plus me-1"></span>Assign Selected
                                </button>
                                {/if}
                            </div>
                        </div>
                        <div class="table-responsive text-nowrap">
                            <table class="table table-hover">
                                <thead>
                                    <tr class="text-nowrap">
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>University</th>
                                        <th>Major</th>
                                        <th>Semester</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {#if mentees.length > 0}
                                {#if pagination(mentees, currentPage, showRowData).length == 0}
                                {returnNada(currentPage = currentPage-1)}
                                {/if}
                                {#each pagination(mentees, currentPage, showRowData) as m, i}
                                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                <tr id="data-{m.id}" class="{m.cssClass}" 
                                    on:click={() => {
                                        if(selectedMentee.some(item => item.id == m.id)){
                                            m.cssClass = ''
                                            selectedMentee = selectedMentee.filter(mentee => {
                                                return mentee.id != m.id
                                            })
                                            jquery(`#data-${m.id}`).removeClass('table-success')
                                        }else{
                                            m.cssClass = 'table-success'
                                            selectedMentee.push(m)
                                            jquery(`#data-${m.id}`).addClass('table-success')
                                        }
                                    }}
                                    on:mouseover={() => jquery(`#data-${m.id}`).css('cursor', 'pointer')}>
                                    <td class="text-center">{m.number}</td>
                                    <td>{m.name}</td>
                                    <td>{m.university}</td>
                                    <td>{m.major}</td>
                                    <td class="text-center">{m.semester}</td>
                                    <td>{m.email}</td>
                                    <td>{m.phone}</td>
                                    <td class="text-center {m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
                                </tr>
                                {/each}
                                {/if}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination bind:currentPage={currentPage} bind:dataList={mentees} showRowData={showRowData}/>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>