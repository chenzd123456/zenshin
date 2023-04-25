<template>
    <div class="layout">
        <div class="container">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped>
.layout {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.container {
    flex-grow: 0;
    flex-shrink: 1;
}
</style>