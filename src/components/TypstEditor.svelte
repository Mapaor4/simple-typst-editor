<script lang="ts">

  // SVELTE EDITOR UI (FOR INSPIRATION ONLY)

  import { onMount } from 'svelte'
  import { TypstCompilerService, type CompileStatus } from '$lib/typst/TypstCompilerService'
  import { debounce, downloadPdfFromUrl } from '$lib/utils/helpers'
  
  let typstCode = $state(`= Hello Typst

This is a test.`)
  let status = $state<CompileStatus>('idle')
  let pdfUrl = $state<string | null>(null)
  let errorMsg = $state<string | null>(null)
  
  let compilerService: TypstCompilerService | null = null
  let debouncedCompile: ReturnType<typeof debounce> | null = null
  
  // Watch for code changes and trigger debounced compile
  $effect(() => {
    const code = typstCode
    if (debouncedCompile && compilerService) {
      debouncedCompile(code)
    }
  })
  
  onMount(() => {
    // Initialize compiler service
    compilerService = new TypstCompilerService()
    
    // Listen to compile events
    const unsubscribe = compilerService.addListener({
      onStatusChange: (newStatus) => {
        status = newStatus
      },
      onSuccess: (pdf, url) => {
        pdfUrl = url
        errorMsg = null
      },
      onError: (error) => {
        errorMsg = error
        pdfUrl = null
      },
    })
    
    // Create debounced compile function
    debouncedCompile = debounce(async (code: string) => {
      if (compilerService) {
        await compilerService.compile(code)
      }
    }, 1000)
    
    return () => {
      debouncedCompile?.cancel()
      unsubscribe()
      compilerService?.dispose()
    }
  })
  
  async function handleCompileNow() {
    if (compilerService) {
      await compilerService.compile(typstCode)
    }
  }
  
  function handleDownload() {
    if (pdfUrl) {
      downloadPdfFromUrl(pdfUrl, 'document.pdf')
    }
  }
</script>

<div class="editor-container">
  <div class="navbar">
    <h1 class="title">Typst Online Editor</h1>
    <div class="status">
      {#if status === 'compiling'}⏳ Compiling...
      {:else if status === 'done'}✅ Ready
      {:else if status === 'error'}❌ Error
      {:else}Ready{/if}
    </div>
    <button class="btn" onclick={handleCompileNow} disabled={status === 'compiling'}>
      Compile Now
    </button>
    {#if pdfUrl}
      <button class="btn" onclick={handleDownload}>Download PDF</button>
    {/if}
  </div>
  
  <div class="content">
    <div class="editor-pane">
      <textarea 
        bind:value={typstCode}
        placeholder="Type Typst code here..."
      ></textarea>
    </div>
    
    <div class="preview-pane">
      {#if pdfUrl}
        <iframe src={pdfUrl} title="PDF Preview" class="pdf-iframe"></iframe>
      {:else}
        <div class="preview-placeholder">
          {#if status === 'compiling'}
            <p>⏳ Compiling...</p>
          {:else if status === 'error'}
            <p style="color: #f44336">❌ Error</p>
            <pre>{errorMsg}</pre>
          {:else}
            <p>Click "Compile Now" to generate PDF</p>
          {/if}
          <p style="margin-top: 1rem; font-size: 0.875rem;">Code: {typstCode.length} chars</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #1e1e1e;
    color: #fff;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #252525;
    border-bottom: 1px solid #333;
  }

  .title {
    margin: 0;
    font-size: 1.25rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .editor-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #333;
  }

  textarea {
    flex: 1;
    background: #1e1e1e;
    color: #fff;
    border: none;
    padding: 1rem;
    font-family: monospace;
    font-size: 14px;
    resize: none;
  }

  .preview-pane {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2a2a2a;
    position: relative;
  }

  .pdf-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .preview-placeholder {
    text-align: center;
    color: #888;
  }
</style>
