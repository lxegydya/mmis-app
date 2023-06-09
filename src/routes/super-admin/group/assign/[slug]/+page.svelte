<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
    import Navbar from "../../../../../components/navbar.svelte";
	import { onMount } from "svelte";
	import ApiController from "../../../../../ApiController";
    import jquery from "jquery";

    export let data

    let mentees = null
    let status = false

    let assignStatus = false

    let selectedMentee = []

    let getMenteesNotInGroup = () => {
        ApiController({
            method:'GET',
            endpoint:`mentee/not-in-group`
        }).then(response => {
            sortData(response?.data.data)
            status = true
        })
    }

    let sortData = (data) => {
        mentees = data
        mentees = mentees.sort((a,b) => {
            let x = a.name.toLowerCase()
            let y = b.name.toLowerCase()

            if(x>y){return 1}
            if(x<y){return -1}
            return 0
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
                alert('Mentee Assigned!')
                window.location.href = `/super-admin/group/detail/${data.params.slug}`
            }
        })
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
	<Sidebar activePage="group" />
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
                                    <input type="text" class="form-control" placeholder="Mentee Name" id="filter-name">
                                </div>
                                {#if assignStatus}
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
                                {#each mentees as m, i}
                                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                <tr id="data-{m.id}" class="{selectedMentee.includes(m) ? 'table-success' : ''}" on:click={() => {
                                    if(selectedMentee.includes(m)){
                                        selectedMentee = selectedMentee.filter(mentee => {
                                            return mentee.id != m.id
                                        })
                                        jquery(`#data-${m.id}`).removeClass('table-success')
                                    }else{
                                        selectedMentee.push(m)
                                        jquery(`#data-${m.id}`).addClass('table-success')
                                    }

                                    if(selectedMentee.length > 0){
                                        assignStatus = true
                                    }
                                }}
                                on:mouseover={() => jquery(`#data-${m.id}`).css('cursor', 'pointer')}>
                                    <td class="text-center">{i+1}</td>
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
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>