<script>
    // @ts-nocheck
    
    import Sidebar from "../../../components/sidebar.svelte";
    import Navbar from "../../../components/navbar.svelte";
    import Pagination from "../../../components/pagination.svelte";
    import Footer from "../../../components/footer.svelte";
    import ApiController from "../../../ApiController";
    import { onMount } from "svelte";
    import toDate from "../../../CustomTime";
    import pagination from "../../../CustomPagination";

    let batches = null
    let programs = null
    let types = null
    let assignmentsReal = null
    let assignments = null
    let status = false

    let currentPage = 1
    let showRowData = 10

    let getAssignments = () => {
        ApiController({
            method:"GET",
            endpoint:'assignments'
        }).then(response => {
            batches = response.data.data.batches
            programs = response.data.data.programs
            types = response.data.data.types
            assignmentsReal = response.data.data.assignments
            assignments = assignmentsReal
            status = true
        })
    }

    let deleteAssignment = id => {
        ApiController({
            method:"POST",
            endpoint:'assignment/delete',
            datas:{id}
        }).then(response => {
            if(response.data.msg == 'success'){
                alert('Assignment Deleted!')
                getAssignments()
            }
        })
    }

    onMount(async () => {
        getAssignments()
    })
</script>
    
<svelte:head>
    <title>Assignments</title>
    <html lang="en" />
</svelte:head>

<div class="d-flex h-100">
    <Sidebar activePage="assignment" />
    <div class="w-100 d-flex flex-column">
        <Navbar />
        <div class="wrapper">
            <div class="container-xxl flex-grow-1 container-p-y">
                <h4 class="fw-bold py-3 mb-4">
                    Assignments
                </h4>
                {#if status}
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Assignments</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Activity Name">
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Batches</option>
                                            {#each batches as b}
                                                <option value="{b.batch_name}">{b.batch_name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Programs</option>
                                            {#each programs as p}
                                            <option value="{p.program_name}">{p.program_name}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Type</option>
                                            {#each types as t}
                                            <option value="{t.type}">{t.type}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary text-nowrap" on:click={() => window.location.href = '/super-admin/assignment/manage-type'}>
                                        Manage Type
                                    </button>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = '/super-admin/assignment/create'}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Assignment
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive text-nowrap">
                                <table class="table table-hover">
                                    <thead>
                                        <tr class="text-nowrap">
                                            <th class="text-center">NO.</th>
                                            <th>Assignment Title</th>
                                            <th style="max-width: 350px; white-space: wrap !important;">Description</th>
                                            <th class="text-center">Batch</th>
                                            <th>Program</th>
                                            <th class="text-center">Deadline</th>
                                            <th class="text-center">Type</th>
                                            <th class="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each pagination(assignments, currentPage, showRowData) as a, i}
                                        <tr>
                                            <td class="text-center">{i+1}</td>
                                            <td>{a.name}</td>
                                            <td style="max-width: 350px; white-space: wrap !important;">{a.description}</td>
                                            <td class="text-center">{a.batch_name}</td>
                                            <td>{a.program_name}</td>
                                            <td class="text-center">{toDate(a.deadline)}</td>
                                            <td class="text-center">{a.type}</td>
                                            <td class="text-center">
                                                <button class="btn btn-sm btn-outline-warning" on:click={() => {
                                                    window.location.href = `/super-admin/assignment/edit/${a.id}`
                                                }}>Edit</button>
                                                <button class="btn btn-sm btn-outline-danger" on:click={() => {
                                                    deleteAssignment(a.id)
                                                }}>Delete</button>
                                            </td>
                                        </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Pagination bind:currentPage={currentPage} bind:dataList={assignments} showRowData={showRowData} position='end'/>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>