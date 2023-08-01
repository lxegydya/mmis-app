<script type="text/javascript">
// @ts-nocheck

	import { fly, scale } from 'svelte/transition';

	export let currentPage
	export let dataList
    export let showRowData
</script>

{#if dataList.length > showRowData}
<nav aria-label="Page navigation" class="mt-3 d-flex align-items-center justify-content-between">
    <div>
        Showing <b>{(showRowData*currentPage)-(showRowData)+1}</b> to <b>{(Math.ceil(dataList.length) / showRowData) <= currentPage ? dataList.length : (showRowData * currentPage)}</b> from <b>{dataList.length}</b> List of Data
    </div>
    <ul class="pagination">
        {#if currentPage >= 3}
        <li class="page-item prev">
            <button class="page-link" on:click={() => {
                currentPage = 1
            }}><i class="tf-icon bx bx-chevrons-left"></i></button>
        </li>
        {/if}

        {#if currentPage >= Math.ceil(dataList.length / showRowData) && currentPage != 2}
        <li class="page-item">
            <button class="page-link" on:click={() => {
                currentPage = currentPage - 2
            }}>{currentPage-2}</button>
        </li>
        {/if}

        {#if currentPage > 1}
        <li class="page-item">
            <button class="page-link" on:click={() => {
                currentPage = currentPage - 1
            }}>{currentPage-1}</button>
        </li>
        {/if}

        <li class="page-item active">
            <button class="page-link">{currentPage}</button>
        </li>

        {#if currentPage < Math.ceil(dataList.length / showRowData)}
        <li class="page-item">
            <button class="page-link" on:click={() => {
                currentPage = currentPage + 1
            }}>{currentPage+1}</button>
        </li>
        {/if}

        {#if currentPage + 2 <= Math.ceil(dataList.length / showRowData)}
        <li class="page-item next">
            <button class="page-link" on:click={() => {
                currentPage = Math.ceil(dataList.length / showRowData)
            }}><i class="tf-icon bx bx-chevrons-right"></i></button>
        </li>
        {/if}
    </ul>
</nav>
{/if}