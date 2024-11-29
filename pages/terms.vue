<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
    <TheNavbar />
    
    <div class="max-w-4xl mx-auto px-6 pt-32 pb-24">
      <article class="bg-white rounded-2xl border border-stone-200 p-8 md:p-12 prose prose-stone max-w-none">
        <ContentDoc path="/terms-of-service" />
      </article>
    </div>

    <TheFooter />
  </div>
</template> 

<script setup>
useHead({
  script: [
  {
      type: 'text/javascript',
      children: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "p56ykifasc");`
    }
  ]
})
</script>