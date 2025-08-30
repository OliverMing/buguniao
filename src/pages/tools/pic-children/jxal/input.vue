<template>
    <div>
       <UploadFile v-model="image" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            image: ''
        }
    },
    watch: {
        image(val) {
            this.$emit("input",val)
        }
    }
}
</script>