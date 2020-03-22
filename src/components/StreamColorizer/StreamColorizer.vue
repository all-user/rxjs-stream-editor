<template>
  <div class="StreamColorizer-root">
    <div class="StreamColorizer-colorMatcherRoot">
      <textarea-autosize
        class="StreamColorizer-colorMatcherSourceCode"
        v-model="boundColorMatcherSourceCode"
        rows="1"
      />
    </div>
    <div class="StreamColorizer-colorDefinitionsRoot">
      <PhotoshopPicker
        class="StreamColorizer-colorPicker"
        v-if="selectedColorDefinitionId"
        :value="boundColorCode"
        ref="colorPicker"
        @input="handleColorPickerInput"
        @ok="handleColorPickerOk"
        @cancel="handleColorPickerCancel"
      />
      <div class="StreamColorizer-colorDefinitionItemsWrapper">
        <div class="StreamColorizer-colorDefinitionItem"></div>
        <div class="StreamColorizer-colorDefinitionColumnHeaders">
          <div
            v-for="column in colorDefinitionColumnHeaders"
            :key="column"
            class="StreamColorizer-colorDefinitionItem"
            v-text="column"
          />
        </div>
        <div class="StreamColorizer-colorDefinitionRowHeaders">
          <div
            v-for="row in colorDefinitionRowHeaders"
            :key="row"
            class="StreamColorizer-colorDefinitionItem"
            v-text="row"
          />
        </div>
        <div class="StreamColorizer-colorDefinitionItems">
          <div
            v-for="colorDef in colorDefinitions"
            :key="colorDef.id"
            :style="getColorDefinitionStyle(colorDef)"
            class="StreamColorizer-colorDefinitionItem"
            @click="handleColorDefinitionClick(colorDef)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./StreamColorizer.ts"></script>
<style lang="stylus" src="./StreamColorizer.styl" scoped></style>
